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
    };

    // 2. Extension Match Verification
    if (!allowedMimeToExt[mimeType].includes(ext)) {
      return NextResponse.json({ error: "MIME type and file extension mismatch." }, { status: 415 });
    }

    // 4. Safe Filename Generation (Using UUID)
    const filename = `${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // 5. Path Traversal Protection (basename ensures only filename is written)
    const filePath = path.join(uploadDir, path.basename(filename));
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file due to internal error." }, { status: 500 });
  }
}
