import updateProductDB from "../../../database/Products/updateProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import addNewProductNotify from "../../../queues/product-notify/productNotifyQueue.js";
import { io } from "../../../lib/socketConnect.js";

const updateProductSale = catchAsyncError(async (req, res, next) => {
  const { productId, toggle } = req.body;

  if (!productId || typeof toggle !== "boolean") {
    return next(
      new HandleGlobalError("ProductId or Toggle is not provided", 404)
    );
  }

  const result = await updateProductDB(productId, { isReadyToSale: toggle });

  if (toggle) {
    await addNewProductNotify(productId, "out_of_sale");
  }

  io.emit("update-sale", { productId, isReadyToSale: toggle });

  res.json(result);
});

export default updateProductSale;
