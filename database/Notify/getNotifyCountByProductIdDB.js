import ProductNotify from "../../models/ProductNotify.js";

const getNotifyCountByProductIdDB = async (productId, type) => {
  if (!productId || !type) throw new Error("ProductId or type is not provided");

  const counts = await ProductNotify.countDocuments({
    product: productId,
    notifyType: type,
  });

  return counts;
};

export default getNotifyCountByProductIdDB;
