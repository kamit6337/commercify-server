import ProductNotify from "../../models/ProductNotify.js";

const findNotifyDB = async (productId, userId, type) => {
  if (!productId || !userId || !type)
    throw new Error("ProductId or UserId or type is not provided");

  const result = await ProductNotify.find({
    product: productId,
    user: userId,
    notifyType: type,
  }).lean();

  return result;
};

export default findNotifyDB;
