import Product from "../../models/ProductModel.js";
import {
  getSearchProductsRedis,
  setSearchProductsRedis,
} from "../../redis/Products/SearchProducts.js";
import sanitizedQuery from "../../utils/javaScript/sanitizedQuery.js";

const getSearchProductsDB = async (q) => {
  const query = sanitizedQuery(q);

  const get = await getSearchProductsRedis(query);
  if (get) return get;

  const products = await Product.aggregate([
    {
      $match: {
        title: { $regex: new RegExp(sanitizedQuery(query), "i") },
      },
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

  await setSearchProductsRedis(query, products);

  return products;
};

export default getSearchProductsDB;
