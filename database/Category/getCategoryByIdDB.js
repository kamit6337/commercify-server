import geAllCategoryDB from "./geAllCategoryDB.js";

const getCategoryByIdDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("CategoryId is not provided");
  }

  const categoriesFromRedis = await geAllCategoryDB();

  const getCategory = ids.map((categoryId) => {
    return categoriesFromRedis.find(
      (category) => category._id?.toString() === categoryId?.toString()
    );
  });

  const isNullPresent = getCategory.some((category) => !category);

  if (isNullPresent) {
    throw new Error("Error in getting Categories from Ids");
  }

  return getCategory;
};

export default getCategoryByIdDB;
