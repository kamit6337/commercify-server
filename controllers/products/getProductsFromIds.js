import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getCompleteProductInfo from "./getCompleteProductInfo.js";

const getProductsFromIds = catchAsyncError(async (req, res, next) => {
  const { ids, countryId } = req.query;

  if (!ids || ids.length === 0 || !countryId) {
    return next(new HandleGlobalError("Ids or countryId is not provided", 404));
  }

  const products = await getProductsFromIdsDB(ids);

  if (products.length === 0) {
    res.json([]);
    return;
  }

  const productDetails = await getCompleteProductInfo(products, countryId);

  res.json(productDetails);
});

export default getProductsFromIds;
