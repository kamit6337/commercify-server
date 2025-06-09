import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getCompleteProductInfo from "./getCompleteProductInfo.js";

const getSingleProduct = catchAsyncError(async (req, res, next) => {
  const { id, countryId } = req.query;

  if (!id || !countryId) {
    return next(new HandleGlobalError("Id or countryId  is not provided"));
  }

  const queryProduct = await getProductsFromIdsDB([id]);

  const product = queryProduct[0];

  if (!product) {
    res.json(null);
    return;
  }

  const productDetails = await getCompleteProductInfo([product], countryId);

  res.json(productDetails[0]);
});

export default getSingleProduct;
