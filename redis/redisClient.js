import { Redis } from "ioredis";
import { environment } from "../utils/environment.js";

console.log("Redis url", environment.REDIS_URL);

const redisClient = new Redis(
  environment.REDIS_URL || {
    host: "redis",
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  }
);

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
