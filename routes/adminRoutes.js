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

const router = express.Router();

router.get("/", getAdminCountDetails);

router
  .route("/products")
  .get(getProductsCountDetails)
  .post(addSingleProduct)
  .patch(updateSingleProduct);

router.route("/category").post(addNewCategory).patch(updateSingleCategory);

router.get("/order-status/ordered", getAllOrdered);
router.get("/order-status/undelivered", getAllUndelivered);
router.get("/order-status/delivered", getAllDelivered);
router.get("/order-status/cancelled", getAllCancelled);
router.get("/order-status/returned", getAllReturned);

router.route("/order-status/deliver").patch(updateUserCheckoutOrder);

export default router;
