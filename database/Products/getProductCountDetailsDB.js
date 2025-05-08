import Category from "../../models/CategoryModel.js";
import Product from "../../models/ProductModel.js";

const getProductCountDetailsDB = async () => {
  const allProductsCount = await Product.countDocuments();

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
        categoryProductsCount: { $size: "$categoryProducts" },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        categoryProductsCount: 1,
      },
    },
  ]);

  const result = {
    products: allProductsCount,
    categoryProducts,
  };

  return result;
};

export default getProductCountDetailsDB;
