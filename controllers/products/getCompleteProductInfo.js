import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";
import getCategoryByIdDB from "../../database/Category/getCategoryByIdDB.js";
import getRatingByProductIds from "../../database/Ratings/getRatingByProductIds.js";
import getProductPriceByProductIdDB from "../../database/ProductPrice/getProductPriceByProductIdDB.js";

const getCompleteProductInfo = async (products, countryId) => {
  if (!Array.isArray(products) || products.length === 0 || countryId) {
    throw new Error("Products or CountryId is not provided");
  }

  const productIds = products.map((product) => product._id?.toString());

  const productsPrice = await getProductPriceByProductIdDB(
    productIds,
    countryId
  );

  const productsPriceMap = new Map(
    productsPrice.map((obj) => [
      obj.product?.toString(),
      {
        price: obj.price,
        discountPercentage: obj.discountPercentage,
        discountedPrice: obj.discountedPrice,
        deliveryCharge: obj.deliveryCharge,
      },
    ])
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

  return modifyProducts;
};

export default getCompleteProductInfo;
