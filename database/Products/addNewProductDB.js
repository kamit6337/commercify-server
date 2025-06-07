import Product from "../../models/ProductModel.js";
import { setNewProductIntoRedis } from "../../redis/Products/LatestProducts.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";
import getCategoryByIdDB from "../Category/getCategoryByIdDB.js";

const addNewProductDB = async (obj) => {
  const product = await Product.create({ ...obj });

  const parseProduct = JSON.parse(JSON.stringify(product));

  const findCategory = await getCategoryByIdDB(parseProduct.category);

  const productPrice = await productPriceFromRedis(
    parseProduct._id,
    parseProduct.price,
    parseProduct.discountPercentage
  );

  const modifyProduct = {
    ...parseProduct,
    category: findCategory,
    ratingCount: 0,
    avgRating: 0,
    price: productPrice,
  };

  // await setNewProductIntoRedis(modifyProduct);

  return modifyProduct;
};

export default addNewProductDB;
