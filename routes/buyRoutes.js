import express from "express";
import getUserBuys from "../controllers/buy/getUserBuys.js";
import cancelOrder from "../controllers/buy/cancelOrder.js";
import returnOrder from "../controllers/buy/returnOrder.js";
import getUserBuysDetails from "../controllers/buy/getUserBuysDetails.js";

const router = express.Router();

router.get("/", getUserBuys);
router.get("/counts", getUserBuysDetails);

router.patch("/cancel", cancelOrder);
router.patch("/return", returnOrder);

export default router;
