const { CRYPTO_ALGOS } = require("../constants");
const crypto = require("crypto");

function decryptChaCha20(text, key, iv) {
  const decipher = crypto.createDecipheriv("chacha20", key, iv);
  let decryptedData = decipher.update(text, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return { decryptedData };
}

function decryptAES(text, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decryptedData = decipher.update(text, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return { decryptedData };
}

function decrypt(data, algorithm, SecretKey, iv) {
  switch (algorithm) {
    case CRYPTO_ALGOS.AES:
      return decryptAES(data, SecretKey, iv);
    case CRYPTO_ALGOS.CHA_CHA:
      return decryptChaCha20(data, SecretKey, iv);
    default:
      throw new Error("Algorithm not supported");
  }
}

module.exports = { decrypt };
