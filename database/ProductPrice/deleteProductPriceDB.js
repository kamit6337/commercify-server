import ProductPrice from "../../models/ProductPriceModel.js";

const deleteProductPriceDB = async (id) => {
  if (!id) throw new Error("Id is not provided");

  const result = await ProductPrice.deleteMany({
    product: id,
  });

  return result;
};

export default deleteProductPriceDB;
