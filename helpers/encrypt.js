const { CRYPTO_ALGOS } = require("../constants");
const crypto = require("crypto");

function encryptChaCha20(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("chacha20", key, iv);
  let encryptedData = cipher.update(text, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return { encryptedData, iv: iv.toString("hex") };
}

function encryptAES(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(text, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return { encryptedData, iv: iv.toString("hex") };
}

function encrypt(data, algorithm, SecretKey) {
  switch (algorithm) {
    case CRYPTO_ALGOS.AES:
      return encryptAES(data, SecretKey);
    case CRYPTO_ALGOS.CHA_CHA:
      return encryptChaCha20(data, SecretKey);
    default:
      throw new Error("Algorithm not supported");
  }
}

module.exports = { encrypt };
