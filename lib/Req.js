import getUserById from "../database/User/getUserById.js";
import { decrypt } from "./encryptAndDecrypt.js";

const BEARER = "Bearer";

const Req = async (req) => {
  if (!req || !req.headers) {
    throw new Error("Something went wrong. Please try later");
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(BEARER)) {
    throw new Error("Your do not have active session. Please Login");
  }

  const token = authorization.split(" ").at(-1);

  if (!token) {
    throw new Error("Please login again");
  }

  const decoded = decrypt(token);

  const findUser = await getUserById(decoded.id);

  if (!findUser) {
    throw new Error("UnAuthorised Access. Please login again");
  }

  const currentMilli = Date.now();
  const expireTokenMin = 30 * 60 * 1000; //30 minutes
  const diffeInMilli = decoded.exp - currentMilli;

  if (diffeInMilli < expireTokenMin) {
    throw new Error("Your Session has expired. Please Login Again.");
  }

  // MARK: CHECK UPDATED-AT WHEN PASSWORD UPDATE, SO LOGIN AGAIN IF PASSWORD RESET
  const updatedAtInMilli = new Date(findUser.passwordLastUpdated).getTime();

  if (decoded.iat + 5000 <= updatedAtInMilli) {
    //5 seconds advantage
    throw new Error("Please login again...");
  }

  return findUser;
};

export default Req;
