import catchAsyncError from "../lib/catchAsyncError.js";
import cookieOptions from "../utils/cookieOptions.js";
import decrypt from "../utils/encryption/decrypt.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";
import Req from "../utils/Req.js";

const verifyOtpMiddleware = catchAsyncError(async (req, res, next) => {
  const { _otp } = Req(req);
  const { mobile, otp } = req.body;

  if (!_otp || !mobile || !otp) {
    return next(new HandleGlobalError("Error in verifiying OTP", 404));
  }

  const { mobile: actualMobile, otp: actualOTP, expire } = decrypt(_otp);

  // NOTE: CHECK EXPIRE
  const currentTime = Date.now();
  if (currentTime > expire) {
    return next(
      new HandleGlobalError(
        "Time has passed to verify. Click on Resend OTP to verify again..."
      )
    );
  }

  // NOTE: VERIFY MOBILE NUMBER
  if (mobile !== actualMobile) {
    return next(
      new HandleGlobalError("Issue in verify Mobile Number. Please try later")
    );
  }

  // NOTE: VERIFY OTP NUMBER
  if (actualOTP !== Number(otp)) {
    return next(
      new HandleGlobalError(
        "Your OTP is incorrect. Please provide a valid OTP."
      )
    );
  }

  res.clearCookie("_otp", cookieOptions);

  next();
});

export default verifyOtpMiddleware;
