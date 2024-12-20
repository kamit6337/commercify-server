import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const returnOrder = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: buyId } = req.body;

  if (!buyId) {
    return next(new HandleGlobalError("Id id not provided", 404));
  }

  const obj = {
    isReturned: true,
  };

  await userBuyUpdateDB(userId, buyId, obj);

  res.json("Order is returned");
});

export default returnOrder;
