import Buy from "../../models/BuyModel.js";
import { setSingleUserBuyRedis } from "../../redis/Buy/userBuys.js";

const userBuyUpdateDB = async (userId, buyId, obj) => {
  const updateBuy = await Buy.findOneAndUpdate(
    {
      _id: buyId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await setSingleUserBuyRedis(userId, updateBuy);

  return updateBuy;
};

export default userBuyUpdateDB;
