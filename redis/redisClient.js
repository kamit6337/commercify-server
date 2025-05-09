import Redis from "ioredis";
import { environment } from "../utils/environment.js";

const redisOptions = environment.REDIS_URL || {
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

// ✅ Standard Redis client (for get/set/del etc.)
const redisClient = new Redis(redisOptions);

// 📣 Publisher for Pub/Sub
export const redisPub = new Redis(redisOptions);

// 👂 Subscriber for Pub/Sub
export const redisSub = new Redis(redisOptions);

// Optional: log connection events for debugging
[redisClient, redisPub, redisSub].forEach((client, idx) => {
  const name = ["redisClient", "redisPub", "redisSub"][idx];

  client.on("connect", () => console.log(`${name} connected`));
  client.on("ready", () => console.log(`${name} ready`));
  client.on("error", (err) => console.error(`${name} error:`, err));
});

export default redisClient;
