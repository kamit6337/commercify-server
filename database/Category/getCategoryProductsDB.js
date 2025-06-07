import Product from "../../models/ProductModel.js";
import {
  getCaterogyProductsRedis,
  setCaterogyProductsRedis,
} from "../../redis/Category/categoryProducts.js";

const getCategoryProductsDB = async (categoryId, page) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    throw new Error("Page number must be greater than 0");
  }

  const get = await getCaterogyProductsRedis(categoryId, page, limit);
  if (get) return get;

  const products = await Product.find({
    category: categoryId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  await setCaterogyProductsRedis(categoryId, products);

  return products;
};

export default getCategoryProductsDB;
