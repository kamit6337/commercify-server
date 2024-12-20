import crypto from "crypto";
import { environment } from "../utils/environment.js";

const ENCRYPTION_KEY = environment.ENCRYPTION_KEY;
const ENCRYPTION_IV = environment.ENCRYPTION_IV;

const algorithm = "aes-256-cbc";

export const encrypt = (obj, expires = environment.EXPIRES_IN) => {
  const objStr = JSON.stringify({
    ...obj,
    iat: Date.now(),
    exp: Date.now() + expires,
  });

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(ENCRYPTION_IV, "hex")
  );
  let encrypted = cipher.update(objStr, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (encryptedText) => {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(ENCRYPTION_IV, "hex")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    const jsonString = decrypted.toString();
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Please login again...");
  }
};
