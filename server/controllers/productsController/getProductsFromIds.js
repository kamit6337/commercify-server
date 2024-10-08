import getProductsFromIdsDB from "../../databases/Products/getProductsFromIdsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getProductsFromIds = catchAsyncError(async (req, res, next) => {
  const { ids } = req.query;

  if (!ids || ids.length === 0) {
    return next(new HandleGlobalError("Ids is not provided", 404));
  }

  const products = await getProductsFromIdsDB(ids);

  res.json(products);
});

export default getProductsFromIds;
