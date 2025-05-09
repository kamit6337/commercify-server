import "./lib/passport.js";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import buyRouter from "./routes/buyRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import additionalRouter from "./routes/additionalRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import protectRoute from "./middlewares/protectRoute.js";
import unidentifiedError from "./middlewares/unidentifiedError.js";
import webhookCheckout from "./controllers/payment/webhookCheckout.js";
import protectAdminRoutes from "./middlewares/protectAdminRoutes.js";
import { app, io, httpServer } from "./lib/socketConnect.js";
import newConnection from "./socket/newConnection.js";
import joinRooms from "./socket/joinRooms.js";
import onDisconnect from "./socket/onDisconnect.js";
import socketAuthMiddleware from "./middlewares/socketAuthMiddleware.js";
import "./redis/Pub-Sub/newOrder.js";

// MARK: WEBHOOK-CHECKOUT
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server" });
});

app.get("/health", (req, res) => {
  res.json({ message: "Server Health is fine and good" });
});

// NOTE: SOCKET CONNECTION
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.userId;
  socket.join(userId);

  newConnection(socket);
  joinRooms(socket);
  onDisconnect(socket);
});

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/ratings", protectRoute, ratingRouter);
app.use("/address", protectRoute, addressRouter);
app.use("/buy", protectRoute, buyRouter);
app.use("/payment", protectRoute, paymentRouter);
app.use("/stripe", stripeRouter);
app.use("/search", searchRouter);
app.use("/additional", additionalRouter);
app.use("/admin", protectAdminRoutes, adminRouter);
app.use("/file", protectAdminRoutes, fileRouter);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", unidentifiedError);

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export { app };

export default httpServer;
