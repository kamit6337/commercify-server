import Product from "../../models/ProductModel.js";

const deleteProductDB = async (id) => {
  if (!id) throw new Error("Id is not provided");

  const result = await Product.deleteOne({
    _id: id,
  });

  return result;
};

export default deleteProductDB;
