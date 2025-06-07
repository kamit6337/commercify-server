import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import buysFromOrderId from "../../database/Buy/buysFromOrderId.js";
import { getUserOrderCheckoutFromRedis } from "../../redis/order/userCheckout.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { orderId } = req.query;

  if (!orderId) {
    return next(new HandleGlobalError("Please provide ID", 404));
  }

  const buysFromRedis = await getUserOrderCheckoutFromRedis(orderId);

  if (!buysFromRedis) {
    const buysFromDB = await buysFromOrderId(orderId);
    res.json(buysFromDB);
    return;
  }

  res.json(buysFromRedis);
});

export default afterSuccessfulPayment;
