export const AUTH_CONFIG = {
  // Default administrator credentials (extensible to multiple later)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@ahvaanam.com",
  // Hashed representation of "admin123" (salt:hash using PBKDF2-SHA512)
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || "0ffbe4786c6656d0f86943b71838273e:fbeb909db3b7d233b576fb6756c3c9f96fb446136d4a0d7271e925fbaafeea044e809467074baa95c82d4c87799e4e497e8eb73694b9777c838b6276c3e0971f",
  
  // JWT Token secret for signing session cookies
  SESSION_SECRET: process.env.SESSION_SECRET || "ahvaanam_super_secure_session_secret_token_32_chars_long",
  
  // Cookie attributes
  COOKIE_NAME: "session",
  SESSION_EXPIRY_SECONDS: 3600, // 1 hour inactivity timeout
};
