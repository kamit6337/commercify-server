import Stock from "../../models/StockModel.js";

const updateStockDB = async (productId, stock) => {
  if (!productId || !stock)
    throw new Error("ProductId or Stock is not provided");

  const updateStock = await Stock.findOneAndUpdate(
    {
      product: productId,
    },
    {
      stock: parseInt(stock),
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return updateStock;
};

export default updateStockDB;
