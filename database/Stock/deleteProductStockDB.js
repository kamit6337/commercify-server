import Stock from "../../models/StockModel.js";

const deleteProductStockDB = async (id) => {
  if (!id) throw new Error("Id is not provided");

  const result = await Stock.deleteOne({
    product: id,
  });

  return result;
};

export default deleteProductStockDB;
