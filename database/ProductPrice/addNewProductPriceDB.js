import ProductPrice from "../../models/ProductPriceModel.js";

const addNewProductPriceDB = async (productPrice) => {
  if (!Array.isArray(productPrice) || productPrice.length === 0) {
    throw new Error("Product Price is not provided");
  }

  const newPrice = await ProductPrice.insertMany(productPrice);

  return JSON.parse(JSON.stringify(newPrice));
};

export default addNewProductPriceDB;
