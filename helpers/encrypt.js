const { CRYPTO_ALGOS } = require("../constants");
const crypto = require("crypto");

require("dotenv").config();
const {
  AES_256_CBC_SECRET_KEY,
  AES_128_CBC_SECRET_KEY,
  AES_256_GCM_SECRET_KEY,
  AES_128_GCM_SECRET_KEY,
  CHA_CHA_20_SECRET_KEY,
} = process.env;

const AES128SecretKey = Buffer.from(AES_128_CBC_SECRET_KEY, "hex");
const AES256SecretKey = Buffer.from(AES_256_CBC_SECRET_KEY, "hex");
const ChaCha20SecretKey = Buffer.from(CHA_CHA_20_SECRET_KEY, "hex");
const AES128GCMSecretKey = Buffer.from(AES_128_GCM_SECRET_KEY, "hex");
const AES256GCMSecretKey = Buffer.from(AES_256_GCM_SECRET_KEY, "hex");

function encryptChaCha20(text, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("chacha20-poly1305", key, iv);

  let encryptedData = cipher.update(text, "utf8", "base64");
  encryptedData += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64");

  return {
    encryptedData,
    iv: iv.toString("base64"),
    authTag,
  };
}

function encryptAESCBC(text, key, type) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(type, key, iv);
  let encryptedData = cipher.update(text, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return { encryptedData, iv: iv.toString("base64") };
}

function encryptAESGCM(text, key, algorithm) {
  const iv = crypto.randomBytes(12); // 96-bit nonce recommended for GCM
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedData = cipher.update(text, "utf8", "base64");
  encryptedData += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64");

  return {
    encryptedData,
    iv: iv.toString("base64"),
    authTag,
  };
}

function encrypt(data, algorithm) {
  switch (algorithm) {
    case CRYPTO_ALGOS.AES_128_CBC:
      return encryptAESCBC(data, AES128SecretKey, "aes-128-cbc");
    case CRYPTO_ALGOS.AES_256_CBC:
      return encryptAESCBC(data, AES256SecretKey, "aes-256-cbc");
    case CRYPTO_ALGOS.CHA_CHA_20:
      return encryptChaCha20(data, ChaCha20SecretKey);
    case CRYPTO_ALGOS.AES_128_GCM:
      return encryptAESGCM(data, AES128GCMSecretKey, "aes-128-gcm");
    case CRYPTO_ALGOS.AES_256_GCM:
      return encryptAESGCM(data, AES256GCMSecretKey, "aes-256-gcm");
    default:
      throw new Error("Algorithm not supported");
  }
}

module.exports = { encrypt };
