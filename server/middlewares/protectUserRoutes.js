import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../lib/catchAsyncError.js";
import Req from "../utils/Req.js";
import decrypt from "../utils/encryption/decrypt.js";
import UserFindById from "../databases/User/UserFindById.js";

const protectUserRoute = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  if (!token) {
    return next(new HandleGlobalError("UnAuthorized Access", 403, "Failed"));
  }

  const decodedId = decrypt(token);

  const findUser = await UserFindById(decodedId.id);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "UnAuthorized Access. You are not our User",
        403,
        "Failed"
      )
    );
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectUserRoute;
