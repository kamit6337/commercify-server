import updateProductDB from "../../../database/Products/updateProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import addNewProductNotify from "../../../queues/productNotifyQueue.js";

const updateProductSale = catchAsyncError(async (req, res, next) => {
  const { productId, toggle } = req.body;

  if (!productId || !toggle) {
    return next(
      new HandleGlobalError("ProductId or Toggle is not provided", 404)
    );
  }

  const result = await updateProductDB(productId, { isReadyToSale: toggle });

  if (toggle) {
    await addNewProductNotify(productId, "out_of_sale");
  }

  res.json(result);
});

export default updateProductSale;
