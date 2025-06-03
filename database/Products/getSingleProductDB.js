import Product from "../../models/ProductModel.js";
import {
  getSingleProductRedis,
  setSingleProductRedis,
} from "../../redis/Products/SingleProduct.js";
import ObjectID from "../../lib/ObjectID.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const getSingleProductDB = async (id) => {
  const get = await getSingleProductRedis(id);
  if (get) return get;

  const product = await Product.aggregate([
    {
      $match: {
        _id: ObjectID(id),
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

  const singleProduct = product[0];

  const productPrice = await productPriceFromRedis(
    singleProduct._id,
    singleProduct.price,
    singleProduct.discountPercentage
  );

  const modifyProduct = {
    ...JSON.parse(JSON.stringify(singleProduct)),
    price: productPrice,
  };

  await setSingleProductRedis(modifyProduct);

  return modifyProduct;
};

export default getSingleProductDB;
