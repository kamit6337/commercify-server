import express from "express";
import getUserAddress from "../controllers/address/getUserAddress.js";
import createNewAddress from "../controllers/address/createNewAddress.js";
import updateAddress from "../controllers/address/updateAddress.js";
import deleteAddress from "../controllers/address/deleteAddress.js";

const router = express.Router();

router
  .route("/")
  .get(getUserAddress)
  .post(createNewAddress)
  .patch(updateAddress)
  .delete(deleteAddress);

export default router;
