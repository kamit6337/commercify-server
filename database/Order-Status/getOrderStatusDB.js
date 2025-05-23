import Buy from "../../models/BuyModel.js";

const getOrderStatusDB = async (time = "month") => {
  const now = new Date();
  const startDate = new Date(now);

  if (time === "day") {
    startDate.setDate(startDate.getDate() - 1);
  } else if (time === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const result = await Buy.aggregate([
    {
      $match: {
        createdAt: {
          $lt: now,
          $gte: startDate,
        },
      },
    },

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
  ]);

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
