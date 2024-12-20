import redisClient from "../redisClient.js";

export const getUserOTPRedis = async (email) => {
  const get = await redisClient.get(`User-OTP-Verification:${email}`);
  return get || null;
};

export const getUserSignUpDataRedis = async (email) => {
  const get = await redisClient.get(`User-SignUp-Data:${email}`);
  return get ? JSON.parse(get) : null;
};

export const setUserOTPIntoRedis = async (email, otp) => {
  if (!email || !otp) return;

  await redisClient.set(`User-OTP-Verification:${email}`, otp, "EX", 10 * 60);
};

export const setUserSignupDataIntoRedis = async (email, data) => {
  if (!email || !data) return;

  await redisClient.set(
    `User-SignUp-Data:${email}`,
    JSON.stringify(data),
    "EX",
    3600
  );
};
