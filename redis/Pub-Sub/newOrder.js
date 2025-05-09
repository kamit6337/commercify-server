import getAdminUsers from "../../database/User/getAdminUsers.js";
import { io } from "../../lib/socketConnect.js";
import { redisSub } from "../redisClient.js";

// Listen for Redis "new-order" events
await redisSub.subscribe("new-order", async (message) => {
  const orderData = JSON.parse(message);

  console.log("orderData", orderData);

  const adminUsers = await getAdminUsers();
  console.log("adminUsers", adminUsers);

  adminUsers.forEach((admin) => {
    if (!admin) return;
    io.to(admin).emit("new-orders", orderData);
  });
});
