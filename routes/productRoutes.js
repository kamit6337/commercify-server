import express from "express";
import getProducts from "../controllers/products/getProducts.js";
import addProduct from "../controllers/products/addProduct.js";
import updateProduct from "../controllers/products/updateProduct.js";
import deleteProduct from "../controllers/products/deleteProduct.js";
import protectAdminRoutes from "../middlewares/protectAdminRoutes.js";
import getProductsFromIds from "../controllers/products/getProductsFromIds.js";

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
