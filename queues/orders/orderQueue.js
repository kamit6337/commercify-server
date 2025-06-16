import { Queue } from "bullmq";
import redisClient, { createWorkerRedis } from "../../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = createWorkerRedis();


const orderQueue = new Queue("new-order", { connection: bullConnection });

const addNewOrder = async (orderId, stripeId) => {
  await orderQueue.add(
    `notify-${orderId}`,
    { orderId, stripeId },
    {
      attempts: 3, // total 5 tries (1 original + 4 retries)
      backoff: {
        type: "exponential", // or "fixed"
        delay: 2000, // base delay in ms (1s)
      },
    }
  );
};

export default addNewOrder;
