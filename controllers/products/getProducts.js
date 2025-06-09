import catchAsyncError from "../../lib/catchAsyncError.js";
import getLatestProductsDB from "../../database/Products/getLatestProductsDB.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getCompleteProductInfo from "./getCompleteProductInfo.js";

const getProducts = catchAsyncError(async (req, res, next) => {
  const { page = 1, countryId } = req.query;

  if (!countryId) {
    return next(new HandleGlobalError("countryId is not provided", 404));
  }

  // NOTE: IF CATEGORY NAME OR ID IS NOT PROVIDED THEN SEND ALL PRODUCTS
  const products = await getLatestProductsDB(page);

  if (products.length === 0) {
    res.json([]);
    return;
  }

  const productDetails = await getCompleteProductInfo(products, countryId);

  res.json(productDetails);
});

export default getProducts;
