import Product from "../../models/ProductModel.js";
import { deleteSingleProductRedis } from "../../redis/Products/SingleProduct.js";

const updateProductDB = async (productId, obj) => {
  const updateProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await deleteSingleProductRedis(productId);

  return updateProduct;
};

export default updateProductDB;
