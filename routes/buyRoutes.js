import express from "express";
import getUserBuys from "../controllers/buy/getUserBuys.js";
import cancelOrder from "../controllers/buy/cancelOrder.js";
import returnOrder from "../controllers/buy/returnOrder.js";
import getUserBuysCount from "../controllers/buy/getUserBuysCount.js";
import getSingleUserBuy from "../controllers/buy/getSingleUserBuy.js";

const router = express.Router();

router.get("/", getUserBuys);
router.get("/counts", getUserBuysCount);
router.get("/single", getSingleUserBuy);

router.patch("/cancel", cancelOrder);
router.patch("/return", returnOrder);

export default router;
