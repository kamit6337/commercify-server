import createNotifyDB from "../../database/Notify/createNotifyDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const createNewNotify = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { productId, type } = req.body;

  if (!productId || !type) {
    return next(new HandleGlobalError("ProductId or Type is not provided"));
  }

  const response = await createNotifyDB(productId, userId, type);

  res.json(response);
});

export default createNewNotify;
