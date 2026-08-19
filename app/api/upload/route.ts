import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { uploadMetadataSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. File Metadata Validation with Zod
    const parsed = uploadMetadataSchema.safeParse({
      size: file.size,
      type: file.type,
      name: file.name
    });

    if (!parsed.success) {
      const sizeErr = parsed.error.issues.find(err => err.path.includes("size"));
      const typeErr = parsed.error.issues.find(err => err.path.includes("type"));
      const status = sizeErr ? 413 : (typeErr ? 415 : 400);

      return NextResponse.json({
        error: "Validation failed",
        details: parsed.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
      }, { status });
    }

    const mimeType = file.type.toLowerCase();
    const ext = path.extname(file.name).toLowerCase();

    const allowedMimeToExt: Record<string, string[]> = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "audio/mpeg": [".mp3"],
      "audio/mp3": [".mp3"],
      "audio/wav": [".wav"],
      "audio/x-wav": [".wav"],
      "audio/m4a": [".m4a"],
      "audio/x-m4a": [".m4a"],
      "audio/aac": [".aac"],
      "audio/ogg": [".ogg", ".oga"],
      "audio/mp4": [".m4a", ".mp4"]
    };

    // 2. Extension Match Verification
    const validExts = allowedMimeToExt[mimeType];
    if (!validExts || !validExts.includes(ext)) {
      return NextResponse.json({ error: "MIME type and file extension mismatch." }, { status: 415 });
    }

    // 4. Safe Filename Generation (Using UUID)
    const filename = `${crypto.randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. Try Supabase Cloud Storage first (works seamlessly on Vercel and production)
    try {
      const { getAdminDb } = await import("@/lib/db");
      const adminDb = getAdminDb();
      const bucketName = "uploads";

      let { data: uploadData, error: uploadError } = await adminDb.storage
        .from(bucketName)
        .upload(filename, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
        // Try creating public bucket automatically
        await adminDb.storage.createBucket(bucketName, { public: true }).catch(() => null);
        const retry = await adminDb.storage.from(bucketName).upload(filename, buffer, {
          contentType: mimeType,
          upsert: true
        });
        uploadData = retry.data;
        uploadError = retry.error;
      }

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = adminDb.storage.from(bucketName).getPublicUrl(filename);
        if (publicUrlData?.publicUrl) {
          return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
        }
      }
    } catch (storageErr) {
      console.warn("Supabase storage upload error, falling back to filesystem:", storageErr);
    }

    // 6. Local Filesystem Fallback (for local development)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, path.basename(filename));
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    } catch (fsErr: any) {
      console.error("Local filesystem upload error:", fsErr);
      return NextResponse.json({ 
        error: fsErr.message || "Failed to upload file due to read-only serverless environment. Please ensure Supabase storage bucket 'uploads' is enabled." 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload route uncaught exception:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file due to internal error." }, { status: 500 });
  }
}
