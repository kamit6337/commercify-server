import Category from "../../models/CategoryModel.js";
import { setNewCategoryIntoRedis } from "../../redis/Category/category.js";

const addNewCategoryDB = async (title) => {
  if (!title) {
    throw new Error("Title is not provided");
  }

  const category = await Category.create({
    title,
  });

  await setNewCategoryIntoRedis(category);

  return category;
};

export default addNewCategoryDB;
