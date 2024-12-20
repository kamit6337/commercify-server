import catchAsyncError from "../../../lib/catchAsyncError.js";
import sendingEmail from "../../../utils/email/email.js";
import otpTemplate from "../../../utils/email/otpTemplate.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import generateOTP from "../../../utils/javaScript/generateOTP.js";
import { setUserOTPIntoRedis } from "../../../redis/Auth/signUp.js";

const resendOtp = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HandleGlobalError("Email is not provided"));
  }

  const newOtp = generateOTP();

  const html = otpTemplate(newOtp);
  await sendingEmail(email, "OTP for verification", html);

  await setUserOTPIntoRedis(email, newOtp);

  resjson({
    message: "Successfull Re-Send OTP to Email",
  });
});
export default resendOtp;
