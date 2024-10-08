import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import encrypt from "../../../utils/encryption/encrypt.js";
import cookieOptions from "../../../utils/cookieOptions.js";

import UserFindByMobile from "../../../databases/User/UserFindByMobile.js";
const checkLoginUser = catchAsyncError(async (req, res, next) => {
  let { mobile } = req.body;

  if (!mobile) {
    return next(new HandleGlobalError("All fields is not provided", 404));
  }

  // NOTE: CHECK IS THIS OUR ALREADY USER OR NOT
  const findUser = await UserFindByMobile(mobile);

  if (!findUser) {
    return next(
      new HandleGlobalError("You are not signed up. Please sign up first.", 404)
    );
  }

  const obj = {
    id: String(findUser._id),
    role: findUser.role,
  };

  const makeEncrypt = encrypt(obj);

  res.cookie("_log", makeEncrypt, cookieOptions);

  next();
});

export default checkLoginUser;
