import "./lib/passport.js";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import protectRoute from "./middlewares/protectRoute.js";
import unidentifiedError from "./middlewares/unidentifiedError.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server" });
});

app.get("/health", (req, res) => {
  res.json({ message: "Server Health is fine and good" });
});

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", unidentifiedError);

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
