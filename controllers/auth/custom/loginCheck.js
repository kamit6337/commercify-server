import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import Req from "../../../utils/Req.js";
import getCurrentTime from "../../../utils/javaScript/getCurrentTime.js";
import decrypt from "../../../utils/encryption/decrypt.js";
import UserFindById from "../../../databases/User/UserFindById.js";

const loginCheck = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  if (!token) {
    return next(
      new HandleGlobalError(
        "You do not have current session. Please Login Again.",
        400
      )
    );
  }

  const decoded = decrypt(token);

  const currentMilli = getCurrentTime();

  const expireTokenMin = 30 * 60 * 1000; //30 minutes
  const diffeInMilli = decoded.exp - currentMilli;

  if (diffeInMilli < expireTokenMin) {
    return next(
      new HandleGlobalError(
        "Your Session has expired. Please Login Again.",
        400
      )
    );
  }

  const findUser = await UserFindById(decoded.id);

  if (!findUser) {
    return next(
      new HandleGlobalError("Unauthorised Access. Please Login Again.", 400)
    );
  }

  res.status(200).json({
    message: "User is present",
    _id: findUser._id,
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    mobile: findUser.mobile,
    role: findUser.role,
  });
});

export default loginCheck;
