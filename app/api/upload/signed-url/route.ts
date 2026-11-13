import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { ALLOWED_UPLOAD_MIME_TO_EXT, uploadMetadataSchema } from "@/lib/validation";

const BUCKET_NAME = "uploads";

/**
 * Generates a short-lived signed upload URL for direct browser-to-Supabase Storage uploads.
 * Bypasses serverless request body limits (e.g. Vercel's 4.5 MB cap) for videos and large media.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, size } = body ?? {};

    const parsed = uploadMetadataSchema.safeParse({ size, type, name });
    if (!parsed.success) {
      const sizeErr = parsed.error.issues.find((err) => err.path.includes("size"));
      const typeErr = parsed.error.issues.find((err) => err.path.includes("type"));
      const status = sizeErr ? 413 : typeErr ? 415 : 400;

      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Validation failed",
          details: parsed.error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status }
      );
    }

    const mimeType = String(type).toLowerCase();
    const ext = path.extname(String(name)).toLowerCase();
    const validExts = ALLOWED_UPLOAD_MIME_TO_EXT[mimeType];

    if (!validExts || !validExts.includes(ext)) {
      return NextResponse.json(
        { error: "MIME type and file extension mismatch." },
        { status: 415 }
      );
    }

    const filename = `${crypto.randomUUID()}${ext}`;

    const { getAdminDb } = await import("@/lib/db");
    const adminDb = getAdminDb();

    let { data, error } = await adminDb.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(filename);

    if (error && error.message?.toLowerCase().includes("not found")) {
      await adminDb.storage
        .createBucket(BUCKET_NAME, { public: true })
        .catch(() => null);
      const retry = await adminDb.storage
        .from(BUCKET_NAME)
        .createSignedUploadUrl(filename);
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Direct storage upload unavailable" },
        { status: 501 }
      );
    }

    const { data: publicUrlData } = adminDb.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to initialize upload" },
      { status: 500 }
    );
  }
}
