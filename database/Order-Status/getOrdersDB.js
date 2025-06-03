import Buy from "../../models/BuyModel.js";

const getOrdersDB = async (time) => {
  if (!time) {
    throw new Error("Time is not provided");
  }

  const now = new Date();
  const startDate = new Date(now);

  if (time === "day") {
    startDate.setDate(startDate.getDate() - 1);
  } else if (time === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (time === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else if (time === "6month") {
    startDate.setMonth(startDate.getMonth() - 6);
  }

  if (time === "all") {
    const result = await Buy.find().lean();
    return result;
  }

  const result = await Buy.find({
    createdAt: {
      $lt: now,
      $gte: startDate,
    },
  }).lean();

  return result;
};

export default getOrdersDB;
