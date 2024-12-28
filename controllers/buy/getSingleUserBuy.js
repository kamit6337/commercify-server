import getSingleBuyDB from "../../database/Buy/getSingleBuyDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const getSingleUserBuy = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided"));
  }

  const buy = await getSingleBuyDB(userId, id);

  res.json(buy);
});
export default getSingleUserBuy;
