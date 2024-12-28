import Buy from "../../models/BuyModel.js";
import {
  getUserBuysBySessionID,
  setUserBuysBySessionID,
} from "../../redis/Buy/userBuysSessionID.js";

const buysFromSessionID = async (cartSessionId) => {
  const get = await getUserBuysBySessionID(cartSessionId);

  if (get) {
    return get;
  }

  const buys = await Buy.find({
    cartSessionId,
  })
    .sort("-createdAt")
    .populate("product")
    .populate("address")
    .lean();

  await setUserBuysBySessionID(cartSessionId, buys);

  return buys;
};

export default buysFromSessionID;
