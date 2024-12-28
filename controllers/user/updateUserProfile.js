import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, photo, dial_code, mobile } = req.body;

  if (!name || !photo || !dial_code || !mobile) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const obj = {
    name,
    photo,
    dial_code,
    mobile,
  };

  const user = await patchUserProfile(userId, obj);

  res.json(user);
});

export default updateUserProfile;
