import { createClient } from "@/utils/supabase/client";

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/m4a",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogv": "video/ogg",
};

function resolveMimeType(file: File): string {
  if (file.type && file.type.trim()) return file.type;
  const dotIdx = file.name.lastIndexOf(".");
  const ext = dotIdx >= 0 ? file.name.slice(dotIdx).toLowerCase() : "";
  return EXT_TO_MIME[ext] || "application/octet-stream";
}

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (res.status === 413 || /request entity too large/i.test(text)) {
      throw new Error("File exceeds the 4.5 MB server limit. Please use cloud storage or a smaller file.");
    }
    throw new Error(text || `Upload failed (${res.status})`);
  }
}

/**
 * Uploads an image, audio, or video file.
 * Uses a signed Supabase Storage URL when available (bypassing serverless body size limits),
 * and falls back to `/api/upload` for local development.
 */
export async function uploadMediaFile(file: File): Promise<string> {
  const contentType = resolveMimeType(file);

  const signedRes = await fetch("/api/upload/signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      type: contentType,
      size: file.size,
    }),
  });

  if (signedRes.ok) {
    const { token, path, publicUrl } = await parseJsonSafe(signedRes);
    const supabase = createClient();
    const { error: storageErr } = await supabase.storage
      .from("uploads")
      .uploadToSignedUrl(path, token, file, {
        contentType,
        upsert: true,
      });

    if (storageErr) {
      throw new Error(storageErr.message || "Direct storage upload failed");
    }
    return publicUrl;
  }

  // Validation or auth errors (400, 401, 413, 415) should surface immediately
  if (signedRes.status !== 501) {
    const errData = await parseJsonSafe(signedRes);
    throw new Error(errData?.details?.[0]?.message || errData?.error || "Upload failed");
  }

  // Fallback to multipart form upload (e.g. local filesystem dev without Supabase storage)
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(data?.details?.[0]?.message || data?.error || "Upload failed");
  }

  return data.url;
}
