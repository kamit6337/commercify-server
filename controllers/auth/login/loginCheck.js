import catchAsyncError from "../../../lib/catchAsyncError.js";
import Req from "../../../lib/Req.js";

const loginCheck = catchAsyncError(async (req, res, next) => {
  const findUser = await Req(req);

  res.json({
    message: "User is present",
    _id: findUser._id,
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  });
});

export default loginCheck;
