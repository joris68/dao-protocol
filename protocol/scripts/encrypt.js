import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function encrypt(plaintext, key, rawDataHash) {
  const iv = randomBytes(16);
  const payload = JSON.stringify({ rawData: plaintext, rawDataHash });
  const cipher = createCipheriv("aes-256-ctr", key, iv);
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  return {
    alg: "aes-256-ctr",
    iv: iv.toString("base64"),
    data: encrypted.toString("base64"),
  };
}

export function decrypt(envelope, key) {
  const iv = Buffer.from(envelope.iv, "base64");
  const data = Buffer.from(envelope.data, "base64");
  const decipher = createDecipheriv("aes-256-ctr", key, iv);
  const decrypted = decipher.update(data) + decipher.final("utf8");
  const { rawData, rawDataHash } = JSON.parse(decrypted);
  return { rawData, rawDataHash };
}

