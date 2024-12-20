import { randomBytes } from "crypto";

const generateSecureString = () => {
  return randomBytes(32).toString("hex");
};

export default generateSecureString;
