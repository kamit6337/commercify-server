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
  ).lean();

  return JSON.parse(JSON.stringify(updateProduct));
};

export default updateProductDB;
