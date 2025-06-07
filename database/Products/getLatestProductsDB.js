import Product from "../../models/ProductModel.js";
import {
  getLatestProductsRedis,
  setLatestProductsRedis,
} from "../../redis/Products/LatestProducts.js";

const getLatestProductsDB = async (page) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    throw new Error("Page number must be greater than 0");
  }

  // const get = await getLatestProductsRedis(page, limit);
  // if (get) return get;

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // await setLatestProductsRedis(products);

  return products;
};

export default getLatestProductsDB;
