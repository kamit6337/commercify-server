import Product from "../../models/ProductModel.js";
import { setNewProductIntoRedis } from "../../redis/Products/LatestProducts.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const addNewProductDB = async (obj) => {
  const product = await Product.create({ ...obj });

  // await setNewProductIntoRedis(modifyProduct);

  return JSON.parse(JSON.stringify(product));
};

export default addNewProductDB;
