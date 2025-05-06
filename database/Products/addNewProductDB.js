import Product from "../../models/ProductModel.js";
import { setNewProductIntoRedis } from "../../redis/Products/LatestProducts.js";
import getCategoryByIdDB from "../Category/getCategoryByIdDB.js";

const addNewProductDB = async (obj) => {
  const product = await Product.create({ ...obj });

  const parseProduct = JSON.parse(JSON.stringify(product));

  const findCategory = await getCategoryByIdDB(parseProduct.category);

  const modifyProduct = {
    ...parseProduct,
    category: findCategory,
    ratingCount: 0,
    avgRating: 0,
  };

  await setNewProductIntoRedis(modifyProduct);

  return modifyProduct;
};

export default addNewProductDB;
