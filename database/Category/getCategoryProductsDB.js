import Product from "../../models/ProductModel.js";
import {
  getCaterogyProductsRedis,
  setCaterogyProductsRedis,
} from "../../redis/Category/categoryProducts.js";
import ObjectID from "../../lib/ObjectID.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const getCategoryProductsDB = async (categoryId, page) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    throw new Error("Page number must be greater than 0");
  }

  const get = await getCaterogyProductsRedis(categoryId, page, limit);
  if (get) return get;

  const products = await Product.aggregate([
    {
      $match: {
        category: ObjectID(categoryId),
      },
    },
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

  await setCaterogyProductsRedis(categoryId, modifyProducts);

  return modifyProducts;
};

export default getCategoryProductsDB;
