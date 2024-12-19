import catchAsyncError from "../../lib/catchAsyncError.js";
import User from "../../models/UserModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Req from "../../utils/Req.js";
import decrypt from "../../utils/encryption/decrypt.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { _upd } = Req(req);

  if (!_upd) {
    return next(
      new HandleGlobalError("Issue in updating profile. Please try later", 404)
    );
  }

  const { mobile, name, email } = decrypt(_upd);

  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      name,
      email,
      mobile,
    }
  );

  res.json("User is updated");
});

export default updateUserProfile;
