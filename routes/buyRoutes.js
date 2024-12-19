import express from "express";
import getUserBuys from "../controllers/buyController/getUserBuys.js";
import cancelOrder from "../controllers/buyController/cancelOrder.js";
import returnOrder from "../controllers/buyController/returnOrder.js";
import getUserBuysDetails from "../controllers/buyController/getUserBuysDetails.js";

const router = express.Router();

router.get("/", getUserBuys);
router.get("/details", getUserBuysDetails);

router.patch("/cancel", cancelOrder);
router.patch("/return", returnOrder);

export default router;
