import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import buysFromOrderId from "../../database/Buy/buysFromOrderId.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { orderId } = req.query;

  if (!orderId) {
    return next(new HandleGlobalError("Please provide ID", 404));
  }

  const products = await buysFromOrderId(orderId);

  res.json(products);
});

export default afterSuccessfulPayment;
