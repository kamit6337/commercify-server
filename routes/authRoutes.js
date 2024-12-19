import express from "express";
import loginCheck from "../controllers/auth/custom/loginCheck.js";
import signupSendOTP from "../controllers/auth/signup/signupSendOTP.js";
import logout from "../controllers/auth/custom/logout.js";
import sendOtp from "../controllers/auth/otp/sendOtp.js";
import signupVerifyOtp from "../controllers/auth/signup/signupVerifyOtp.js";
import verifyOtpMiddleware from "../middlewares/verifyOtpMiddleware.js";
import checkLoginUser from "../controllers/auth/login/checkLoginUser.js";
import loginUser from "../controllers/auth/login/loginUser.js";

const router = express.Router();

// NOTE: SEND OTP AND VERIFY OTP
//prettier-ignore
router
  .post("/login/send-otp", checkLoginUser, sendOtp)
  .post("/login/verify-otp",verifyOtpMiddleware, loginUser);

// NOTE: SIGNUP THROUGH MOBILE AND VERIFY OTP
router
  .post("/signup/send-otp", signupSendOTP, sendOtp)
  .post("/signup/verify-otp", verifyOtpMiddleware, signupVerifyOtp);

// NOTE: RESEND OTP
router.post("/resendOtp", sendOtp);

// NOTE: CONTINUOUS CHECK LOGIN
router.get("/login/check", loginCheck);

// NOTE: LOGOUT AND UPDATE USER
router.get("/logout", logout);

export default router;
