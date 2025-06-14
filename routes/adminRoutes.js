import express from "express";
import getAdminCountDetails from "../controllers/admin/getAdminCountDetails.js";
import getProductsCountDetails from "../controllers/admin/getProductsCountDetails.js";
import updateSingleProduct from "../controllers/admin/products/updateSingleProduct.js";
import addSingleProduct from "../controllers/admin/products/addSingleProduct.js";
import addNewCategory from "../controllers/admin/category/addNewCategory.js";
import updateSingleCategory from "../controllers/admin/category/updateSingleCategory.js";
import getAllOrdered from "../controllers/admin/order-status/getAllOrdered.js";
import updateUserCheckoutOrder from "../controllers/admin/order-status/updateUserCheckoutOrder.js";
import getAllUndelivered from "../controllers/admin/order-status/getAllUndelivered.js";
import getAllDelivered from "../controllers/admin/order-status/getAllDelivered.js";
import getAllCancelled from "../controllers/admin/order-status/getAllCancelled.js";
import getAllReturned from "../controllers/admin/order-status/getAllReturned.js";
import protectAdminRoutes from "../middlewares/protectAdminRoutes.js";
import getOrdersCount from "../controllers/admin/getOrdersCount.js";
import updateProductStock from "../controllers/admin/stock/updateProductStock.js";
import updateProductSale from "../controllers/admin/products/updateProductSale.js";
import deleteSingleProduct from "../controllers/admin/products/deleteSingleProduct.js";

const router = express.Router();

router.get("/", getAdminCountDetails);
router.get("/orders", getOrdersCount);

router
  .route("/products")
  .get(getProductsCountDetails)
  .post(protectAdminRoutes, addSingleProduct)
  .patch(protectAdminRoutes, updateSingleProduct)
  .delete(protectAdminRoutes, deleteSingleProduct);

router.route("/products/sale").patch(protectAdminRoutes, updateProductSale);
router.route("/products/stock").patch(protectAdminRoutes, updateProductStock);

router
  .route("/category")
  .post(protectAdminRoutes, addNewCategory)
  .patch(protectAdminRoutes, updateSingleCategory);

router.get("/order-status/ordered", getAllOrdered);
router.get("/order-status/undelivered", getAllUndelivered);
router.get("/order-status/delivered", getAllDelivered);
router.get("/order-status/cancelled", getAllCancelled);
router.get("/order-status/returned", getAllReturned);

router.route("/order-status/deliver").patch(updateUserCheckoutOrder);

export default router;
