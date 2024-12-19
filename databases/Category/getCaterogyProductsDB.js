import Product from "../../models/ProductModel.js";
import {
  getCaterogyProductsRedis,
  setCaterogyProductsRedis,
} from "../../redis/Category/categoryProducts.js";
import ObjectID from "../../utils/ObjectID.js";

const getCaterogyProductsDB = async (categoryId, page) => {
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

  await setCaterogyProductsRedis(categoryId, products);

  return products;
};

export default getCaterogyProductsDB;
