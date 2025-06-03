import Buy from "../../models/BuyModel.js";

const getOrderStatusDB = async (time) => {
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

  const pipeline = [
    {
      $group: {
        _id: null,
        ordered: { $sum: 1 },
        undelivered: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isDelivered", false] },
                  { $eq: ["$isCancelled", false] },
                  { $eq: ["$isReturned", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
        delivered: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isDelivered", true] },
                  { $eq: ["$isReturned", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
        cancelled: { $sum: { $cond: ["$isCancelled", 1, 0] } },
        returned: { $sum: { $cond: ["$isReturned", 1, 0] } },
      },
    },
  ];

  if (time !== "all") {
    pipeline.unshift({
      $match: {
        createdAt: {
          $lt: now,
          $gte: startDate,
        },
      },
    });
  }

  const result = await Buy.aggregate(pipeline);

  return (
    result[0] || {
      ordered: 0,
      undelivered: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    }
  );
};

export default getOrderStatusDB;
