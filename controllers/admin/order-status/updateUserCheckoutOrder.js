import userBuyUpdateDB from "../../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import { io } from "../../../lib/socketConnect.js";
import addOrderStatus from "../../../queues/orders/orderStatusQueue.js";

const updateUserCheckoutOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 403));
  }
  const obj = {
    isDelivered: true,
    deliveredDate: Date.now(),
    updatedAt: Date.now(),
  };

  const updateBuy = await userBuyUpdateDB(id, obj);

  await addOrderStatus(updateBuy._id);

  io.to(updateBuy.user.toString()).emit("update-deliver", updateBuy);

  res.json(updateBuy);
});

export default updateUserCheckoutOrder;
