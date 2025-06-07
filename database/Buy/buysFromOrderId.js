import Buy from "../../models/BuyModel.js";

const buysFromOrderId = async (orderId) => {
  if (!orderId) {
    throw new Error("OrderId is not provided");
  }

  const buys = await Buy.find({
    orderId,
  })
    .sort("-createdAt")
    .populate([
      {
        path: "product",
      },
      {
        path: "address",
      },
      {
        path: "country",
      },
    ])
    .lean();

  return buys;
};

export default buysFromOrderId;
