import express from "express";
import {
  getLowStockProducts,
  getInventoryStatus,
  getExpiringProducts,
  getRecentActivities,
} from "../controllers/reports.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // Protect all reports routes

router.get("/low-stock", getLowStockProducts);
router.get("/inventory-status", getInventoryStatus);
router.get("/expiring-soon", getExpiringProducts);
router.get("/recent-activities", getRecentActivities);

export default router;
