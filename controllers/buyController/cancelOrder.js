import userBuyUpdateDB from "../../databases/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const cancelOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id id not provided", 404));
  }

  const obj = {
    isCancelled: true,
  };

  await userBuyUpdateDB(id, obj);

  res.json("Order is cancelled");
});

export default cancelOrder;
