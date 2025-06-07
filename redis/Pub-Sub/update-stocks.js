import getZeroStocksByProductIdsDB from "../../database/Stock/getZeroStocksByProductIdsDB.js";
import { io } from "../../lib/socketConnect.js";
import { redisSub } from "../redisClient.js";

// 1. Subscribe to the channel
await redisSub.subscribe("update-stocks");

// 2. Listen for messages
redisSub.on("message", async (channel, message) => {
  if (channel !== "update-stocks") return;

  const productIds = JSON.parse(message);

  const zeroStocks = await getZeroStocksByProductIdsDB(productIds);

  if (zeroStocks.length === 0) return;

  const updateZeroStocks = zeroStocks.map((obj) => ({
    product: obj.product._id,
    stock: obj.stock,
  }));

  io.emit("update-stocks", updateZeroStocks);
});
