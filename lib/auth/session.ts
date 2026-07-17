import { AUTH_CONFIG } from "./config";
import { cookies } from "next/headers";

// --- WEB CRYPTO HMAC-SHA256 KEY RESOLVER ---
async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(AUTH_CONFIG.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// --- BASE64-URL ENCODE / DECODE HELPER FUNCTIONS ---
function base64UrlEncode(str: string): string {
  const enc = new TextEncoder();
  const bytes = enc.encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const dec = new TextDecoder();
  return dec.decode(bytes);
}

/**
 * Creates an encrypted, signed JWT token with an expiration timestamp.
 */
export async function signSession(payload: any): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const headerStr = base64UrlEncode(JSON.stringify(header));
  
  // Embed expiry directly in the payload
  const exp = Math.floor(Date.now() / 1000) + AUTH_CONFIG.SESSION_EXPIRY_SECONDS;
  const payloadWithExp = { ...payload, exp };
  const payloadStr = base64UrlEncode(JSON.stringify(payloadWithExp));
  
  const tokenInput = `${headerStr}.${payloadStr}`;
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(tokenInput)
  );
  
  const signatureArr = new Uint8Array(signature);
  let signatureBin = "";
  for (let i = 0; i < signatureArr.byteLength; i++) {
    signatureBin += String.fromCharCode(signatureArr[i]);
  }
  const signatureStr = btoa(signatureBin)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
    
  return `${tokenInput}.${signatureStr}`;
}

/**
 * Decrypts and verifies a JWT token. Checks expiration.
 * Returns payload on success, or null on failure.
 */
export async function verifySession(token: string | null): Promise<any | null> {
  if (!token) return null;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerStr, payloadStr, signatureStr] = parts;
    
    const key = await getCryptoKey();
    const tokenInput = `${headerStr}.${payloadStr}`;
    
    // Parse signature back to Uint8Array bytes
    let sigB64 = signatureStr.replace(/-/g, "+").replace(/_/g, "/");
    while (sigB64.length % 4) sigB64 += "=";
    const sigBin = atob(sigB64);
    const sigBytes = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) {
      sigBytes[i] = sigBin.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(tokenInput)
    );
    
    if (!isValid) return null;
    
    const decodedPayload = JSON.parse(base64UrlDecode(payloadStr));
    
    // Check expiration timestamp
    if (decodedPayload.exp && Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      return null; // Token has expired
    }
    
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_CONFIG.COOKIE_NAME);
    const token = sessionCookie?.value || null;
    const session = await verifySession(token);
    return session?.role === "admin";
  } catch {
    return false;
  }
}
