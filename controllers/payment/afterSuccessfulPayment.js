import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import buysFromOrderId from "../../database/Buy/buysFromOrderId.js";
import { getAdminUsersFromRedis } from "../../redis/User/adminUser.js";
import socketConnect from "../../lib/socketConnect.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { io } = socketConnect();
  const { orderId } = req.query;

  if (!orderId) {
    return next(new HandleGlobalError("Please provide ID", 404));
  }

  const buys = await buysFromOrderId(orderId);

  // const adminUsers = await getAdminUsersFromRedis();

  // adminUsers.forEach((admin) => {
  //   if (!admin) return;
  //   io.to(admin).emit("new-orders", buys);
  // });

  res.json(buys);
});

export default afterSuccessfulPayment;
