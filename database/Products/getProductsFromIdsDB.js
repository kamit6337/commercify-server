import Product from "../../models/ProductModel.js";
import {
  getProductFromIdsRedis,
  setProductFromIdsRedis,
} from "../../redis/Products/ProductFromIds.js";
import ObjectID from "../../lib/ObjectID.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

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

  if (products.length === 0) return [];

  const modifyProducts = products.map(async (product) => {
    const productPrice = await productPriceFromRedis(
      product._id,
      product.price,
      product.discountPercentage
    );

    return {
      ...JSON.parse(JSON.stringify(product)),
      price: productPrice,
    };
  });

  await setProductFromIdsRedis(modifyProducts);

  return modifyProducts;
};

export default getProductsFromIdsDB;
