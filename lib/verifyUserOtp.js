import { getUserOTPRedis } from "../redis/Auth/signUp.js";

const verifyUserOtp = async (email, otp) => {
  if (!email || !otp) return null;

  const actualOtp = await getUserOTPRedis(email);

  if (!actualOtp) {
    throw new Error("Time passed. Please click resend to verify");
  }

  if (actualOtp.toString() !== otp?.toString()) {
    throw new Error("Incorrect OTP. Please give correct OTP");
  }
};

export default verifyUserOtp;
