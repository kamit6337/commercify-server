import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const getProductsFromIds = catchAsyncError(async (req, res, next) => {
  const { ids } = req.query;

  if (!ids || ids.length === 0) {
    return next(new HandleGlobalError("Ids is not provided", 404));
  }

  const products = await getProductsFromIdsDB(ids);

  const productIds = products.map((product) => product._id);
  const productStocks = await getStocksByProductIdsDB(productIds);

  const modifyProducts = products.map((product) => {
    const findStock = productStocks.find(
      (obj) => obj.product?.toString() === product._id?.toString()
    );

    return {
      ...product,
      stock: findStock.stock,
    };
  });

  res.json(modifyProducts);
});

export default getProductsFromIds;
