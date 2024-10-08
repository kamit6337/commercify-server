import Category from "../../models/CategoryModel.js";
import {
  getAllCategoryRedis,
  setAllCategoryRedis,
} from "../../redis/Category/category.js";

const geAllCategoryDB = async () => {
  const get = await getAllCategoryRedis();

  if (get) return get;

  const allCategory = await Category.find().lean();

  await setAllCategoryRedis(allCategory);

  return allCategory;
};

export default geAllCategoryDB;
