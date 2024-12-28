import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import buysFromSessionID from "../../database/Buy/buysFromSessionID.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { cartSessionId } = req.query;

  if (!cartSessionId) {
    return next(new HandleGlobalError("Please provide ID", 404));
  }

  const products = await buysFromSessionID(cartSessionId);

  res.json(products);
});

export default afterSuccessfulPayment;
