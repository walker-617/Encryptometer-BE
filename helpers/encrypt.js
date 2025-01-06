const { CRYPTO_ALGOS } = require("../constants");
const crypto = require("crypto");

require("dotenv").config();
const {
  AES_256_CBC_SECRET_KEY,
  AES_128_CBC_SECRET_KEY,
  CHA_CHA_20_SECRET_KEY,
} = process.env;
const AES128SecretKey = Buffer.from(AES_128_CBC_SECRET_KEY, "hex");
const AES256SecretKey = Buffer.from(AES_256_CBC_SECRET_KEY, "hex");
const ChaCha20SecretKey = Buffer.from(CHA_CHA_20_SECRET_KEY, "hex");

function encryptChaCha20(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("chacha20", key, iv);
  let encryptedData = cipher.update(text, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return { encryptedData, iv: iv.toString("base64") };
}

function encryptAES(text, key, type) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(type, key, iv);
  let encryptedData = cipher.update(text, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return { encryptedData, iv: iv.toString("base64") };
}

function encrypt(data, algorithm) {
  switch (algorithm) {
    case CRYPTO_ALGOS.AES_128_CBC:
      return encryptAES(data, AES128SecretKey, "aes-128-cbc");
    case CRYPTO_ALGOS.AES_256_CBC:
      return encryptAES(data, AES256SecretKey, "aes-256-cbc");
    case CRYPTO_ALGOS.CHA_CHA_20:
      return encryptChaCha20(data, ChaCha20SecretKey);
    default:
      throw new Error("Algorithm not supported");
  }
}

module.exports = { encrypt };
