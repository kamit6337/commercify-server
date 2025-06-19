import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const cancelOrder = catchAsyncError(async (req, res, next) => {
  const { id: buyId, reason } = req.body;

  if (!buyId || !reason) {
    return next(new HandleGlobalError("Id or reason is not provided", 404));
  }

  const obj = {
    isCancelled: true,
    reasonForCancelled: reason,
    updatedAt: Date.now,
  };

  const result = await userBuyUpdateDB(buyId, obj);

  res.json(result);
});

export default cancelOrder;
