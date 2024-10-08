import catchAsyncError from "../../../lib/catchAsyncError.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import encrypt from "../../../utils/encryption/encrypt.js";
import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import generateSixDigitRandomNumber from "../../../utils/javaScript/generateSixDigitRandomNumber.js";
import twilio from "twilio";

const client = twilio(
  environment.TWILIO_ACCOUNT_SID,
  environment.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

const sendOtp = catchAsyncError(async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(new HandleGlobalError("Mobile no is not provided", 404));
  }

  const randomNumber = generateSixDigitRandomNumber();

  await client.messages.create({
    to: mobile,
    from: environment.TWILIO_MOBILE_NUMBER,
    body: `Your Commercify verification code is: ${randomNumber}. This code will expire in 10 minutes.`,
  });

  const obj = {
    mobile,
    otp: randomNumber,
    expire: Date.now() + 10 * 60 * 1000, // 10 minutes to expire
  };

  const makeEncrypt = encrypt(obj);

  res.cookie("_otp", makeEncrypt, cookieOptions);

  res.send("OTP send successfully");
});

export default sendOtp;
