import Buy from "../../models/BuyModel.js";
import {
  getSingleBuyFromRedis,
  setSingleUserBuyRedis,
} from "../../redis/Buy/userBuys.js";

const getSingleBuyDB = async (userId, buyId) => {
  const get = await getSingleBuyFromRedis(buyId);

  const buy = await Buy.findOne({
    _id: buyId,
  })
    .populate("product")
    .populate("address");

  await setSingleUserBuyRedis(userId, buy);

  return buy;
};

export default getSingleBuyDB;
