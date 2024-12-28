import postCreateUser from "../../../database/User/postCreateUser.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import verifyUserOtp from "../../../lib/verifyUserOtp.js";
import { getUserSignUpDataRedis } from "../../../redis/Auth/signUp.js";

const verifySignup = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    return next(
      new HandleGlobalError("OTP and Email is not provided. Please provide it")
    );
  }

  await verifyUserOtp(email, otp);

  const userData = await getUserSignUpDataRedis();

  if (!userData) {
    return next(
      new HandleGlobalError("Something went wrong on Sign Up. Please try later")
    );
  }

  const { name, password, dial_code, mobile } = userData;

  const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

  const obj = {
    name,
    email,
    password,
    photo: profilePicUrl,
    dial_code,
    mobile,
  };

  const createUser = await postCreateUser(obj);

  if (!createUser) {
    return next(
      new HandleGlobalError("Issue in Signup. Please try later", 404)
    );
  }

  const token = encrypt({
    id: createUser._id,
    role: createUser.role,
  });

  res.json(token);
});

export default verifySignup;
