import userBuyUpdateDB from "../../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const updateUserCheckoutOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 403));
  }
  const obj = {
    isDelivered: true,
    deliveredDate: Date.now(),
  };

  const response = await userBuyUpdateDB(id, obj);

  res.json(response);
});

export default updateUserCheckoutOrder;
