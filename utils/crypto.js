import crypto from "crypto";

// ambil langsung dari .env
const RAW_SECRET = process.env.SECRET_KEY;

// ubah ke 16 byte → AES-128 (biar hasil pendek)
const KEY = crypto.createHash("md5").update(RAW_SECRET).digest();

// IV tetap (MVP)
const IV = Buffer.alloc(16, 0);

export function encryptId(value) {
  // 🔴 FIX UTAMA DI SINI
  const text = String(value);

  const cipher = crypto.createCipheriv("aes-128-cbc", KEY, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decryptId(encryptedText) {
  let base64 = encryptedText.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const decipher = crypto.createDecipheriv("aes-128-cbc", KEY, IV);
  let decrypted = decipher.update(base64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
