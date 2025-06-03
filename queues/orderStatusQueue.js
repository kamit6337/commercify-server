import { Queue } from "bullmq";
import redisClient from "../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = redisClient.duplicate();

const orderQueue = new Queue("order-status", { connection: bullConnection });

const addOrderStatus = async (buyId) => {
  await orderQueue.add(
    `notify-${buyId}`,
    { buyId },
    {
      attempts: 3, // total 5 tries (1 original + 4 retries)
      backoff: {
        type: "exponential", // or "fixed"
        delay: 2000, // base delay in ms (1s)
      },
    }
  );
};

export default addOrderStatus;
