import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import socketConnect from "../../lib/socketConnect.js";
import { getAdminUsersFromRedis } from "../../redis/User/adminUser.js";

const cancelOrder = catchAsyncError(async (req, res, next) => {
  const { id: buyId, reason } = req.body;
  const { io } = socketConnect();

  if (!buyId || !reason) {
    return next(new HandleGlobalError("Id or reason is not provided", 404));
  }

  const obj = {
    isCancelled: true,
    reasonForCancelled: reason,
  };

  await userBuyUpdateDB(buyId, obj);

  const adminUsers = await getAdminUsersFromRedis();

  adminUsers.forEach((admin) => {
    if (!admin) return;
    io.to(admin).emit("order-cancel", result);
  });

  res.json("Order is cancelled");
});

export default cancelOrder;
