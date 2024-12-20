import { environment } from "../utils/environment.js";
import express from "express";
import passport from "passport";
import signup from "../controllers/auth/signup/signup.js";
import loginCheck from "../controllers/auth/login/loginCheck.js";
import login from "../controllers/auth/login/login.js";
import forgotPassword from "../controllers/auth/forgot-password/forgotPassword.js";
import newPassword from "../controllers/auth/forgot-password/newPassword.js";
import OAuthLogin from "../controllers/auth/OAuth-login/OAuthLogin.js";
import verifySignup from "../controllers/auth/signup/verifySignup.js";
import resendOtp from "../controllers/auth/signup/resendOtp.js";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const router = express.Router();

// Create a rate limiter for the forgot password endpoint
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per `windowMs` (15 minutes)
  message: "Too many requests, please try again later.",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` legacy headers
});

// Optional: Add a slow-down middleware for added protection
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Delay the response after 2 requests
  delayMs: (hits) => hits * 500, // Add 500ms delay per request after 2 requests
});

// NOTE: CONTINUOUS CHECK LOGIN
router.get("/login/check", loginCheck);

// NOTE: FORGOT PASSWORD
router.post(
  "/forgotPassword",
  forgotPasswordRateLimiter,
  speedLimiter,
  forgotPassword
);
router.post("/newPassword", newPassword);

// NOTE: CUSTOM SIGNUP AND LOGIN
router.post("/resendOtp", resendOtp);
router.post("/login", login);
router.post("/signup", signup);
router.post("/signup/verify", verifySignup);

// NOTE: OAUTH SIGNUP AND LOGIN
router.get("/login/OAuth", OAuthLogin);

// NOTE: GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/OAuth",
    failureRedirect: environment.CLIENT_URL,
  })
);

export default router;
