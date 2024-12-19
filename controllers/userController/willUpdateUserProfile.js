import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import encrypt from "../../utils/encryption/encrypt.js";
import cookieOptions from "../../utils/cookieOptions.js";

const willUpdateUserProfile = catchAsyncError(async (req, res, next) => {
  let { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return next(new HandleGlobalError("All Fields are not provided", 404));
  }

  const obj = {
    name,
    email,
    mobile,
  };

  const makeEncrypt = encrypt(obj);

  res.cookie("_upd", makeEncrypt, cookieOptions);

  next();
});

export default willUpdateUserProfile;
