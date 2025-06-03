import Stock from "../../models/StockModel.js";

const getStocksByProductIdsDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("`ids` must be a non-empty array");
  }

  const stocks = await Stock.find({
    product: { $in: ids },
  })
    .select("product stock")
    .lean();

  return stocks;
};

export default getStocksByProductIdsDB;
