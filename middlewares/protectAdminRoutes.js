import HandleGlobalError from "../lib/HandleGlobalError.js";
import catchAsyncError from "../lib/catchAsyncError.js";
import { decrypt } from "../lib/encryptAndDecrypt.js";
import getUserById from "../database/User/getUserById.js";

const BEARER = "Bearer";

const protectAdminRoutes = catchAsyncError(async (req, res, next) => {
  if (!req || !req.headers) {
    throw new Error("Something went wrong. Please try later");
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(BEARER)) {
    throw new Error("Your do not have active session. Please Login");
  }

  const token = authorization.split(" ").at(-1);

  if (!token) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  const decoded = decrypt(token);

  const findUser = await getUserById(decoded.id);

  if (!findUser) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  if (!(findUser.role === "admin" && decoded.role === "admin")) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectAdminRoutes;
