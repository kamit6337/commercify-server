import Category from "../../models/CategoryModel.js";

const getProductCountDetailsDB = async () => {
  const categoryProducts = await Category.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "categoryProducts",
      },
    },
    {
      $addFields: {
        counts: { $size: "$categoryProducts" },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        counts: 1,
      },
    },
  ]);

  return categoryProducts;
};

export default getProductCountDetailsDB;
