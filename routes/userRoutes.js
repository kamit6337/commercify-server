import express from "express";
import willUpdateUserProfile from "../controllers/userController/willUpdateUserProfile.js";
import updateUserProfile from "../controllers/userController/updateUserProfile.js";
import sendOtp from "../controllers/auth/otp/sendOtp.js";
import verifyOtpMiddleware from "../middlewares/verifyOtpMiddleware.js";

const router = express.Router();

router.patch("/send-otp", willUpdateUserProfile, sendOtp);
router.patch("/verify-otp", verifyOtpMiddleware, updateUserProfile);

export default router;
