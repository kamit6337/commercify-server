import ProductNotify from "../../models/ProductNotify.js";

const createNotifyDB = async (productId, userId, type) => {
  if (!productId || !userId || !type)
    throw new Error("ProductId or UserId or type is not provided");

  const result = await ProductNotify.create({
    product: productId,
    user: userId,
    notifyType: type,
  });

  return JSON.parse(JSON.stringify(result));
};

export default createNotifyDB;
