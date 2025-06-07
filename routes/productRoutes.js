import express from "express";
import getProducts from "../controllers/products/getProducts.js";
import getProductsFromIds from "../controllers/products/getProductsFromIds.js";
import getCategoryProducts from "../controllers/products/getCategoryProducts.js";
import getSingleProduct from "../controllers/products/getSingleProduct.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/list", getProductsFromIds);
router.get("/category", getCategoryProducts);
router.get("/single", getSingleProduct);

export default router;
