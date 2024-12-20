import userBuysDB from "../../database/Buy/userBuysDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getUserBuys = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const updateDelivered = await userBuysDB(userId, page);

  res.json(updateDelivered);
});

export default getUserBuys;
