import catchAsyncError from "../lib/catchAsyncError.js";
import Req from "../lib/Req.js";

const protectRoute = catchAsyncError(async (req, res, next) => {
  const findUser = await Req(req);

  req.userId = findUser._id?.toString();
  req.user = findUser;

  next();
});

export default protectRoute;
