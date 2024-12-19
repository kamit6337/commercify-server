import Product from "../../models/ProductModel.js";
import {
  getProductFromIdsRedis,
  setProductFromIdsRedis,
} from "../../redis/Products/ProductFromIds.js";

import ObjectID from "../../utils/ObjectID.js";

const getProductsFromIdsDB = async (ids) => {
  const get = await getProductFromIdsRedis(ids);

  if (get) return get;

  const Ids = ids.map((id) => ObjectID(id));

  const products = await Product.aggregate([
    {
      $match: {
        _id: { $in: Ids },
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

  await setProductFromIdsRedis(products);

  return products;
};

export default getProductsFromIdsDB;
