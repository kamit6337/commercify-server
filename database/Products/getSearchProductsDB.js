import Product from "../../models/ProductModel.js";
import {
  getSearchProductsRedis,
  setSearchProductsRedis,
} from "../../redis/Products/SearchProducts.js";
import sanitizedQuery from "../../utils/javaScript/sanitizedQuery.js";

const getSearchProductsDB = async (q) => {
  const query = sanitizedQuery(q);

  // const get = await getSearchProductsRedis(query);
  // if (get) return get;

  const products = await Product.find({
    title: { $regex: new RegExp(sanitizedQuery(query), "i") },
  }).lean();

  // await setSearchProductsRedis(query, modifyProducts);

  return products;
};

export default getSearchProductsDB;
