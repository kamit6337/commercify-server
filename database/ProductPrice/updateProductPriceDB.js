import ProductPrice from "../../models/ProductPriceModel.js";

const updateProductPriceDB = async (updates) => {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error("Updates is not provided");
  }

  const result = await ProductPrice.bulkWrite(updates);

  return result;
};

export default updateProductPriceDB;
