import Stock from "../../models/StockModel.js";

const createNewStockDB = async (productId, stock) => {
  if (!productId || !stock) {
    throw new Error("ProductId or Stock is not provided");
  }

  const newStock = await Stock.create({
    product: productId,
    stock: parseFloat(stock),
  });

  return JSON.parse(JSON.stringify(newStock));
};

export default createNewStockDB;
