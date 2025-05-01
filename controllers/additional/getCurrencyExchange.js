import catchAsyncError from "../../lib/catchAsyncError.js";
import getExchange from "./getExchange.js";

const getCurrencyExchange = catchAsyncError(async (req, res, next) => {
  const get = await getExchange();
  return res.json(get);
});

export default getCurrencyExchange;
