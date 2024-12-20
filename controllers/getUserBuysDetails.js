import userBuysDetailDB from "../../databases/Buy/userBuysDetailDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getUserBuysDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const countBuys = await userBuysDetailDB(userId);
  res.json(countBuys);
});

export default getUserBuysDetails;
