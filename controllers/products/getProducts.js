import catchAsyncError from "../../lib/catchAsyncError.js";
import getSingleProductDB from "../../database/Products/getSingleProductDB.js";
import getCategoryProductsDB from "../../database/Category/getCategoryProductsDB.js";
import getLatestProductsDB from "../../database/Products/getLatestProductsDB.js";
import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";

const getProducts = catchAsyncError(async (req, res, next) => {
  const { id, categoryId, page = 1 } = req.query;

  // NOTE: IF ID IS PROVIDED THEN SEND PRODUCT OF THAT ID
  if (id) {
    const product = await getSingleProductDB(id);

    const productStock = await getStocksByProductIdsDB([id]);

    const modifyProduct = {
      ...product,
      stock: productStock[0].stock,
    };

    res.json(modifyProduct);
    return;
  }

  // NOTE: IF CATEGORY NAME IS PROVIDED THEN SEND PRODUCT OF THAT CATEGORY
  if (categoryId) {
    const products = await getCategoryProductsDB(categoryId, page);

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
    return;
  }

  // NOTE: IF CATEGORY NAME OR ID IS NOT PROVIDED THEN SEND ALL PRODUCTS
  const products = await getLatestProductsDB(page);

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

export default getProducts;
