import Product from "../../models/ProductModel.js";

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

  return updateProduct;
};

export default updateProductDB;
