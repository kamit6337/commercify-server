import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import Country from "../models/CountryModel.js";
import Product from "../models/ProductModel.js";
import Buy from "../models/BuyModel.js";
import Stock from "../models/StockModel.js";

// Connect to MongoDB
mongoose.connect(environment.MONGO_DB_URI);

// Connection error handling
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Connection successful
mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  try {
    const result = await Product.updateMany(
      {},
      {
        $set: { isReadyToSale: true },
      }
    );

    console.log(result);
  } catch (error) {
    console.error("Error occur in update:", error);
  } finally {
    mongoose.disconnect();
  }
});

// Connection closed
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
