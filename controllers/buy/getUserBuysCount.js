import userBuysCountDB from "../../database/Buy/userBuysCountDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getUserBuysCount = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const countBuys = await userBuysCountDB(userId);
  res.json(countBuys);
});

export default getUserBuysCount;
