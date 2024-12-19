import userBuyUpdateDB from "../../databases/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const returnOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id id not provided", 404));
  }

  const obj = {
    isReturned: true,
  };

  await userBuyUpdateDB(id, obj);

  res.json("Order is returned");
});

export default returnOrder;
