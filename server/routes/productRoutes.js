import express from "express";
import getProductsName from "../controllers/productsController/getProductsName.js";
import getProducts from "../controllers/productsController/getProducts.js";
import addProduct from "../controllers/productsController/addProduct.js";
import updateProduct from "../controllers/productsController/updateProduct.js";
import deleteProduct from "../controllers/productsController/deleteProduct.js";
import protectAdminRoutes from "../middlewares/protectAdminRoutes.js";
import getProductsFromIds from "../controllers/productsController/getProductsFromIds.js";

const app = express();
const router = express.Router();

router.get("/", getProducts);
router.get("/list", getProductsFromIds);

app.use(protectAdminRoutes);

router
  .route("/")
  // .all(protectAdminRoutes)
  .post(addProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
