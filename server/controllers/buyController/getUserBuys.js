import userBuysDB from "../../databases/Buy/userBuysDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getUserBuys = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const updateDelivered = await userBuysDB(userId, page);

  updateDelivered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json(updateDelivered);
});

export default getUserBuys;
