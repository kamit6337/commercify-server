import Buy from "../../models/BuyModel.js";
import {
  getUserBuysRedis,
  setUserBuysRedis,
} from "../../redis/Buy/userBuys.js";
import userBuyUpdateDB from "./userBuyUpdateDB.js";

const userBuysDB = async (userId, page) => {
  const limit = 5;
  const skip = (page - 1) * limit;

  let buys;

  const get = await getUserBuysRedis(userId, page, limit);

  if (get) {
    buys = get;
  } else {
    buys = await Buy.find({
      user: userId,
    })
      .skip(skip)
      .limit(limit)
      .populate("product")
      .populate("address");

    await setUserBuysRedis(userId, buys);
  }

  const updateDelivered = await Promise.all(
    buys.map(async (buy) => {
      const { _id, deliveredDate, isCancelled, isReturned, isDelivered } = buy;

      if (
        !isCancelled &&
        !isReturned &&
        !isDelivered &&
        new Date(deliveredDate).getTime() <= Date.now()
      ) {
        const obj = {
          isDelivered: true,
        };

        const updateBuy = await userBuyUpdateDB(_id.toString(), obj);
        return updateBuy;
      }
      return buy;
    })
  );

  return updateDelivered;
};

export default userBuysDB;
