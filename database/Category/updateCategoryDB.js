import Category from "../../models/CategoryModel.js";
import { updateSingleCategoryIntoRedis } from "../../redis/Category/category.js";

const updateCategoryDB = async (id, obj) => {
  if (!id || !obj) {
    throw new Error("Id or Obj is not provided");
  }

  const category = await Category.findOneAndUpdate(
    {
      _id: id,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await updateSingleCategoryIntoRedis(category);

  return category;
};

export default updateCategoryDB;
