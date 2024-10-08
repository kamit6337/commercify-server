import crypto from "crypto";
import { environment } from "../environment.js";

const ENCRYPTION_KEY = environment.ENCRYPTION_SECRET_KEY;
const ENCRYPTION_IV = environment.ENCRYPTION_SECRET_IV;

const algorithm = "aes-256-cbc";

const decrypt = (encryptedText) => {
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

export default decrypt;
