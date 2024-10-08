import crypto from "crypto";
import { environment } from "../environment.js";

const ENCRYPTION_KEY = environment.ENCRYPTION_SECRET_KEY;
const ENCRYPTION_IV = environment.ENCRYPTION_SECRET_IV;

const algorithm = "aes-256-cbc";

const encrypt = (obj, expires = environment.JWT_EXPIRES_IN) => {
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

export default encrypt;
