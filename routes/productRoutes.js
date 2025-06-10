import express from "express";
import getProducts from "../controllers/products/getProducts.js";
import getProductsFromIds from "../controllers/products/getProductsFromIds.js";
import getCategoryProducts from "../controllers/products/getCategoryProducts.js";
import getSingleProduct from "../controllers/products/getSingleProduct.js";
import getProductPrice from "../controllers/product_price/getProductPrice.js";
import updateProductPrice from "../controllers/product_price/updateProductPrice.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/list", getProductsFromIds);
router.get("/category", getCategoryProducts);
router.get("/single", getSingleProduct);

router.route("/price").get(getProductPrice).patch(updateProductPrice);

export default router;
