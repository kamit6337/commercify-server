import patchUserProfile from "../../../database/User/patchUserProfile.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import {
  deleteKeyFromRedis,
  getUserIdFromRedis,
} from "../../../redis/Auth/forgotPassword.js";

const newPassword = catchAsyncError(async (req, res, next) => {
  const { resetToken, password } = req.body;

  if (!resetToken || !password) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const userId = await getUserIdFromRedis(resetToken);

  if (!userId) {
    return next(
      new HandleGlobalError("Issue in Resetting Password. Try again later", 404)
    );
  }

  const obj = {
    password,
    passwordLastUpdated: Date.now(),
  };

  await patchUserProfile(findUser.id.toString(), obj);

  await deleteKeyFromRedis(resetToken);

  res.json({
    message: "Password has been updated",
  });
});

export default newPassword;
