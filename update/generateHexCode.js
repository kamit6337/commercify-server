import { randomBytes } from "crypto";

const generateHexCode = (length) => {
  return randomBytes(length).toString("hex");
};

const hex32 = generateHexCode(32);
console.log("ENCRYPTION_KEY:", hex32);

const hex16 = generateHexCode(16);
console.log("ENCRYPTION_IV", hex16);
