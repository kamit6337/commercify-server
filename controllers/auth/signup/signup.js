import getUserByEmail from "../../../database/User/getUserByEmail.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import sendingEmail from "../../../utils/email/email.js";
import otpTemplate from "../../../utils/email/otpTemplate.js";
import generateOTP from "../../../utils/javaScript/generateOTP.js";
import {
  setUserOTPIntoRedis,
  setUserSignupDataIntoRedis,
} from "../../../redis/Auth/signUp.js";
import adminEmailList from "../../../data/adminEmailList.js";

const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password, dial_code, mobile } = req.body;

  if (!name || !email || !password || !dial_code || !mobile) {
    return next(new HandleGlobalError("Not provided all field", 404));
  }

  // MARK: CHECK USER IS ALREADY PRESENT OR NOT
  const findUser = await getUserByEmail(email);

  if (findUser) {
    return next(
      new HandleGlobalError(
        "You have already signed up with this Email ID. Please login or signup with different Email ID"
      )
    );
  }

  const otp = generateOTP();
  const html = otpTemplate(otp);
  await sendingEmail(email, "OTP for verification", html);

  await setUserOTPIntoRedis(email, otp);

  const obj = {
    name,
    email,
    password,
    dial_code,
    mobile,
    role: adminEmailList.includes(email) ? "admin" : "user",
  };

  await setUserSignupDataIntoRedis(email, obj);

  res.json({
    message: "Successfull Send OTP to Email",
  });
});

export default signup;
