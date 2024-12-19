import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import buyRouter from "./routes/buyRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import userRouter from "./routes/userRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import protectUserRoutes from "./middlewares/protectUserRoutes.js";
import globalMiddlewares from "./middlewares/globalMiddlwares.js";
import webhookCheckout from "./controllers/payment/webhookCheckout.js";

const app = express();

// MARK: WEBHOOK-CHECKOUT
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.get("/health", (req, res) => {
  res.send("Server health is fine and good");
});

// MARK: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/ratings", protectUserRoutes, ratingRouter);
app.use("/user", protectUserRoutes, userRouter);
app.use("/address", protectUserRoutes, addressRouter);
app.use("/buy", protectUserRoutes, buyRouter);
app.use("/payment", protectUserRoutes, paymentRouter);
app.use("/stripe", stripeRouter);
app.use("/search", searchRouter);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
});

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
