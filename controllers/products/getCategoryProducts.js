import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getCategoryProductsDB from "../../database/Category/getCategoryProductsDB.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";
import getCategoryByIdDB from "../../database/Category/getCategoryByIdDB.js";
import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";
import getRatingByProductIds from "../../database/Ratings/getRatingByProductIds.js";

const getCategoryProducts = catchAsyncError(async (req, res, next) => {
  const { categoryId, currency_code, page = 1 } = req.query;

  if (!categoryId || !currency_code) {
    return next(
      new HandleGlobalError("CategoryId or currency_code is not provided", 404)
    );
  }

  const products = await getCategoryProductsDB(categoryId, page);

  if (products.length === 0) {
    res.json([]);
    return;
  }

  const productIds = products.map((product) => product._id?.toString());

  const productsPrice = await Promise.all(
    products.map(async (product) => {
      const productPrice = await productPriceFromRedis(
        product._id,
        product.price,
        currency_code,
        product.discountPercentage
      );

      return {
        product: product._id,
        price: productPrice,
      };
    })
  );

  const productsPriceMap = new Map(
    productsPrice.map((obj) => [obj.product?.toString(), obj.price])
  );

  const categoryIds = products.map((product) => product.category?.toString());

  const categories = await getCategoryByIdDB(categoryIds);

  const categoriesMap = new Map(
    categories.map((category) => [category._id.toString(), category])
  );

  const productsStock = await getStocksByProductIdsDB(productIds);

  const productsStockMap = new Map(
    productsStock.map((obj) => [obj.product.toString(), obj.stock])
  );

  const productsRating = await getRatingByProductIds(productIds);

  const productsRatingMap = new Map(
    productsRating.map((rating) => [rating.product.toString(), rating])
  );

  const modifyProducts = products.map((product) => {
    const productId = product._id?.toString();

    const defaultRating = {
      product: productId,
      totalRatings: 0,
      totalComments: 0,
      avgRating: 0,
    };

    return {
      ...product,
      price: productsPriceMap.get(productId),
      category: categoriesMap.get(product.category.toString()),
      stock: productsStockMap.get(productId) || 0,
      rating: productsRatingMap.get(productId) || defaultRating,
    };
  });

  res.json(modifyProducts);
});

export default getCategoryProducts;
