import Product from "../../models/ProductModel.js";
import {
  getProductFromIdsRedis,
  setProductFromIdsRedis,
} from "../../redis/Products/ProductFromIds.js";

const getProductsFromIdsDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Ids is not provided");
  }

  // const get = await getProductFromIdsRedis(ids);
  // if (get) return get;

  const products = await Product.find({ _id: { $in: ids } }).lean();

  // await setProductFromIdsRedis(products);

  return products;
};

export default getProductsFromIdsDB;
