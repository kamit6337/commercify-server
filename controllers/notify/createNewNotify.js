import createNotifyDB from "../../database/Notify/createNotifyDB.js";
import findNotifyDB from "../../database/Notify/findNotifyDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const typeList = ["out_of_sale", "out_of_stock"];

const createNewNotify = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { productId, type } = req.body;

  if (!productId || !type || !typeList.includes(type)) {
    return next(new HandleGlobalError("ProductId or Type is not provided"));
  }

  const alreadySaveNotify = await findNotifyDB(productId, userId, type);

  if (alreadySaveNotify.length > 0) {
    return next(new HandleGlobalError("Already saved notify."));
  }

  await createNotifyDB(productId, userId, type);

  if (type === "out_of_sale") {
    res.json("Will notify you when Product comes to sale");
    return;
  }

  res.json("Will notify you when Product comes into Stock");
});

export default createNewNotify;
