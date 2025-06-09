import ProductPrice from "../../models/ProductPriceModel.js";

const getProductPriceByProductIdDB = async (productIds, countryId) => {
  if (!Array.isArray(productIds) || productIds.length === 0 || !countryId) {
    throw new Error("Either ProductIds or CountryId is not provided");
  }

  const prices = await ProductPrice.find({
    product: { $in: productIds },
    country: countryId,
  }).lean();

  return prices;
};

export default getProductPriceByProductIdDB;
