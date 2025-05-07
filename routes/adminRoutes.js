import express from "express";
import getAdminCountDetails from "../controllers/admin/getAdminCountDetails.js";
import getProductsCountDetails from "../controllers/admin/getProductsCountDetails.js";
import updateSingleProduct from "../controllers/admin/products/updateSingleProduct.js";
import addSingleProduct from "../controllers/admin/products/addSingleProduct.js";
import addNewCategory from "../controllers/admin/category/addNewCategory.js";
import updateSingleCategory from "../controllers/admin/category/updateSingleCategory.js";
import getAllOrdered from "../controllers/admin/order-status/getAllOrdered.js";

const router = express.Router();
const app = express();

router.get("/", getAdminCountDetails);

router
  .route("/products")
  .get(getProductsCountDetails)
  .post(addSingleProduct)
  .patch(updateSingleProduct);

router.route("/category").post(addNewCategory).patch(updateSingleCategory);

router.get("/order-status/ordered", getAllOrdered);

export default router;
