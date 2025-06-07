import getCategoryByIdDB from "../../database/Category/getCategoryByIdDB.js";
import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import getRatingByProductIds from "../../database/Ratings/getRatingByProductIds.js";
import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const getSingleProduct = catchAsyncError(async (req, res, next) => {
  const { id, currency_code } = req.query;

  if (!id || !currency_code) {
    return next(new HandleGlobalError("Id or currency code is not provided"));
  }

  const queryProduct = await getProductsFromIdsDB([id]);

  const product = queryProduct[0];

  if (!product) {
    res.json(null);
    return;
  }

  const productPrice = await productPriceFromRedis(
    product._id,
    product.price,
    currency_code,
    product.discountPercentage
  );

  const category = await getCategoryByIdDB([product.category]);
  const productStock = await getStocksByProductIdsDB([id]);

  const productRating = await getRatingByProductIds([id]);

  const defaultRating = {
    product: product._id,
    totalRatings: 0,
    totalComments: 0,
    avgRating: 0,
  };

  const modifyProduct = {
    ...product,
    category: category[0],
    price: productPrice,
    stock: productStock[0].stock || 0,
    rating: productRating[0] || defaultRating,
  };

  res.json(modifyProduct);
});

export default getSingleProduct;
