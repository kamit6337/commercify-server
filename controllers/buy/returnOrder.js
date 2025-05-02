import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const returnOrder = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: buyId, reason } = req.body;

  if (!buyId || !reason) {
    return next(new HandleGlobalError("Id or reason is not provided", 404));
  }

  const obj = {
    isReturned: true,
    reasonForReturned: reason,
  };

  await userBuyUpdateDB(userId, buyId, obj);

  res.json("Order is returned");
});

export default returnOrder;
