import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import sendingEmail from "../../../utils/email/email.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import generateResetToken from "../../../utils/generateResetToken.js";
import resetPasswordLinkTemplate from "../../../utils/email/resetPasswordLinkTemplate.js";
import { environment } from "../../../utils/environment.js";
import { setUserIdIntoRedis } from "../../../redis/Auth/forgotPassword.js";

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HandleGlobalError("Email is not provided", 404));
  }

  const findUser = await getUserByEmail(email);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "You are not our customer. Please signup first",
        403
      )
    );
  }

  const secretToken = generateResetToken();

  const url = `${environment.CLIENT_URL}/newPassword?resetToken=${secretToken}`;

  const html = resetPasswordLinkTemplate(url);
  await sendingEmail(email, "OTP for verification", html);

  await setUserIdIntoRedis(secretToken, findUser._id);

  res.json({
    message: "Reset Password link send to your email",
  });
});

export default forgotPassword;
