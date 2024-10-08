import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import Req from "../../../utils/Req.js";
import cookieOptions from "../../../utils/cookieOptions.js";

const loginUser = catchAsyncError(async (req, res, next) => {
  const { _log } = Req(req);

  if (!_log) {
    return next(new HandleGlobalError("Error in Login. Please try later", 404));
  }

  res.cookie("token", _log, cookieOptions);

  res.clearCookie("_log", cookieOptions);

  res.json({
    message: "OTP Verify sucessfully",
  });
});

export default loginUser;
