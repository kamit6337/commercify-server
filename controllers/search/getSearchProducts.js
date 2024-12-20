import getSearchProductsDB from "../../database/Products/getSearchProductsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const getSearchProducts = catchAsyncError(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new HandleGlobalError("Search Query is not provided", 404));
  }

  const products = await getSearchProductsDB(q);

  res.json(products);
});

export default getSearchProducts;
