import deleteProductPriceDB from "../../../database/ProductPrice/deleteProductPriceDB.js";
import deleteProductDB from "../../../database/Products/deleteProductDB.js";
import deleteProductStockDB from "../../../database/Stock/deleteProductStockDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const deleteSingleProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.query;

  if (!productId) {
    return next(new HandleGlobalError("Product Id is not provided", 404));
  }

  await deleteProductDB(productId);
  await deleteProductStockDB(productId);
  await deleteProductPriceDB(productId);

  res.json("Product deleted successfully");
});

export default deleteSingleProduct;
