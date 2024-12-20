import catchAsyncError from "../../lib/catchAsyncError.js";
import getSingleProductDB from "../../database/Products/getSingleProductDB.js";
import getCaterogyProductsDB from "../../database/Category/getCaterogyProductsDB.js";
import getLatestProductsDB from "../../database/Products/getLatestProductsDB.js";

const getProducts = catchAsyncError(async (req, res, next) => {
  const { id, categoryId, page = 1 } = req.query;

  // NOTE: IF ID IS PROVIDED THEN SEND PRODUCT OF THAT ID
  if (id) {
    const product = await getSingleProductDB(id);
    res.json(product);
    return;
  }

  // NOTE: IF CATEGORY NAME IS PROVIDED THEN SEND PRODUCT OF THAT CATEGORY
  if (categoryId) {
    const products = await getCaterogyProductsDB(categoryId, page);
    res.json(products);
    return;
  }

  // NOTE: IF CATEGORY NAME OR ID IS NOT PROVIDED THEN SEND ALL PRODUCTS
  const products = await getLatestProductsDB(page);
  res.json(products);
});

export default getProducts;
