import Category from "../../models/CategoryModel.js";
import { getSingleCategoryFromRedis } from "../../redis/Category/category.js";

const getCategoryByIdDB = async (categoryId) => {
  if (!categoryId) {
    throw new Error("CategoryId is not provided");
  }

  const get = await getSingleCategoryFromRedis(categoryId);
  if (get) return get;

  const category = await Category.findOne({ _id: categoryId });

  return category;
};

export default getCategoryByIdDB;
