import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import encrypt from "../../../utils/encryption/encrypt.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import User from "../../../models/UserModel.js";

const signupSendOTP = catchAsyncError(async (req, res, next) => {
  let { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return next(new HandleGlobalError("All fields is not provided", 404));
  }

  const findUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (findUser) {
    return next(
      new HandleGlobalError(
        "Email or Mobile is already present. Please try with new ones",
        403
      )
    );
  }

  const obj = {
    name,
    email,
    mobile,
  };

  const makeEncrypt = encrypt(obj);

  res.cookie("_sig", makeEncrypt, cookieOptions);

  next();
});

export default signupSendOTP;
