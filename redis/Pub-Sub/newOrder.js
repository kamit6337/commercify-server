import buysFromOrderId from "../../database/Buy/buysFromOrderId.js";
import getAdminUsers from "../../database/User/getAdminUsers.js";
import { io } from "../../lib/socketConnect.js";
import { getUserOrderCheckoutFromRedis } from "../order/userCheckout.js";
import { redisSub } from "../redisClient.js";

// 1. Subscribe to the channel
await redisSub.subscribe("new-order");

// 2. Listen for messages
redisSub.on("message", async (channel, message) => {
  if (channel !== "new-order") return;

  const orderId = message;

  let buys = await getUserOrderCheckoutFromRedis(orderId);

  if (!buys) {
    buys = await buysFromOrderId(orderId);
  }

  const adminUsers = await getAdminUsers();

  adminUsers.forEach((admin) => {
    if (!admin) return;
    io.to(admin).emit("new-orders", buys);
  });
});
