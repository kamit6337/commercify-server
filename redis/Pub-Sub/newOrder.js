import getAdminUsers from "../../database/User/getAdminUsers.js";
import { io } from "../../lib/socketConnect.js";
import { redisSub } from "../redisClient.js";

// 1. Subscribe to the channel
await redisSub.subscribe("new-order");

// 2. Listen for messages
redisSub.on("message", async (channel, message) => {
  if (channel !== "new-order") return;

  const orderData = JSON.parse(message);

  const adminUsers = await getAdminUsers();

  adminUsers.forEach((admin) => {
    if (!admin) return;
    io.to(admin).emit("new-orders", orderData);
  });
});
