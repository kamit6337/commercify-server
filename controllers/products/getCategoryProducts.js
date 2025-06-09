import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getCategoryProductsDB from "../../database/Category/getCategoryProductsDB.js";
import getCompleteProductInfo from "./getCompleteProductInfo.js";

const getCategoryProducts = catchAsyncError(async (req, res, next) => {
  const { categoryId, countryId, page = 1 } = req.query;

  if (!categoryId || !countryId) {
    return next(
      new HandleGlobalError("CategoryId or countryId is not provided", 404)
    );
  }

  const products = await getCategoryProductsDB(categoryId, page);

  if (products.length === 0) {
    res.json([]);
    return;
  }

  const productDetails = await getCompleteProductInfo(products, countryId);

  res.json(productDetails);
});

export default getCategoryProducts;
