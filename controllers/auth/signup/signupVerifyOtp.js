import catchAsyncError from "../../../lib/catchAsyncError.js";
import User from "../../../models/UserModel.js";
import { setUserIntoRedis } from "../../../redis/User/user.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import Req from "../../../utils/Req.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import decrypt from "../../../utils/encryption/decrypt.js";
import encrypt from "../../../utils/encryption/encrypt.js";

const signupVerifyOtp = catchAsyncError(async (req, res, next) => {
  const { _sig } = Req(req);

  if (!_sig) {
    return next(
      new HandleGlobalError("Error in Signup. Please try later", 404)
    );
  }

  const { mobile, name, email } = decrypt(_sig);

  const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

  const createUser = await User.create({
    name,
    email,
    mobile,
    photo: profilePicUrl,
  });

  await setUserIntoRedis(createUser);

  const token = encrypt({
    id: createUser._id,
    role: createUser.role,
  });

  res.cookie("token", token, cookieOptions);

  res.clearCookie("_sig", cookieOptions);

  res.status(200).json({
    message: "OTP Verify sucessfully",
  });
});

export default signupVerifyOtp;
