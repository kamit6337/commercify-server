import Stock from "../../models/StockModel.js";

const getZeroStocksByProductIdsDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("`ids` must be a non-empty array");
  }

  const stocks = await Stock.find({
    product: { $in: ids },
    stock: 0,
  })
    .select("product stock")
    .populate("product")
    .lean();

  return stocks;
};

export default getZeroStocksByProductIdsDB;
