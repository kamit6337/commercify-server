import getNotifyCountByProductIdDB from "../../../database/Notify/getNotifyCountByProductIdDB.js";
import updateStockDB from "../../../database/Stock/updateStockDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import addNewProductNotify from "../../../queues/product-notify/productNotifyQueue.js";

const updateProductStock = catchAsyncError(async (req, res, next) => {
  const { productId, stock } = req.body;

  if (!productId || !stock) {
    return next(
      new HandleGlobalError("ProductId or Stock is not provided", 404)
    );
  }

  const result = await updateStockDB(productId, stock);

  const notifyCounts = await getNotifyCountByProductIdDB(
    productId,
    "out_of_stock"
  );

  if (stock > notifyCounts) {
    await addNewProductNotify(productId, "out_of_stock");
  }

  res.json(result);
});

export default updateProductStock;
