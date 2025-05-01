import Buy from "../../models/BuyModel.js";
import {
  getUserBuysBySessionID,
  setUserBuysBySessionID,
} from "../../redis/Buy/userBuysSessionID.js";

const buysFromOrderId = async (orderId) => {
  const get = await getUserBuysBySessionID(orderId);

  if (get) {
    return get;
  }

  const buys = await Buy.find({
    orderId,
  })
    .sort("-createdAt")
    .populate("product")
    .populate("address")
    .lean();

  await setUserBuysBySessionID(orderId, buys);

  return buys;
};

export default buysFromOrderId;
