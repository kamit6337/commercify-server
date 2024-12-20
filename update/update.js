import mongoose from "mongoose";
import { environment } from "../utils/environment.js";

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
    console.log("update");
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
