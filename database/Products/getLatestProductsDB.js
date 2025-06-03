import Product from "../../models/ProductModel.js";
import {
  getLatestProductsRedis,
  setLatestProductsRedis,
} from "../../redis/Products/LatestProducts.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const getLatestProductsDB = async (page) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    throw new Error("Page number must be greater than 0");
  }

  const get = await getLatestProductsRedis(page, limit);
  if (get) return get;

  const products = await Product.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "product",
        as: "ratings",
      },
    },
    {
      $addFields: {
        ratingCount: { $size: "$ratings" },
        avgRating: { $avg: "$ratings.rate" },
      },
    },
    {
      $project: {
        ratings: 0,
      },
    },
  ]);

  if (products.length === 0) return [];

  const modifyProducts = await Promise.all(
    products.map(async (product) => {
      const productPrice = await productPriceFromRedis(
        product._id,
        product.price,
        product.discountPercentage
      );

      return {
        ...JSON.parse(JSON.stringify(product)),
        price: productPrice,
      };
    })
  );

  await setLatestProductsRedis(modifyProducts);

  return modifyProducts;
};

export default getLatestProductsDB;
