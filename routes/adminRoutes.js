import express from "express";
import getAdminCountDetails from "../controllers/admin/getAdminCountDetails.js";
import getProductsCountDetails from "../controllers/admin/getProductsCountDetails.js";
import updateSingleProduct from "../controllers/admin/updateSingleProduct.js";

const router = express.Router();

router.get("/", getAdminCountDetails);

router
  .route("/products")
  .get(getProductsCountDetails)
  .patch(updateSingleProduct);

export default router;
