import getStocksByProductIdsDB from "../../database/Stock/getStocksByProductIdsDB.js";
import { io } from "../../lib/socketConnect.js";
import { redisSub } from "../redisClient.js";

// 1. Subscribe to the channel
await redisSub.subscribe("update-stocks");

// 2. Listen for messages
redisSub.on("message", async (channel, message) => {
  if (channel !== "update-stocks") return;

  const productIds = JSON.parse(message);

  const stocks = await getStocksByProductIdsDB(productIds);

  io.emit("update-stocks", stocks);
});
