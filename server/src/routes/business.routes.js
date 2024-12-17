import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkBusinessSetup } from "../middleware/business.middleware.js";
import {
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
  checkProfileStatus
} from "../controllers/business.controller.js";

const router = express.Router();

// Add protect middleware to all routes
router.use(protect);

// Status check endpoint
router.get("/status", checkProfileStatus);

// Business Profile Routes
router.post("/", createBusinessProfile);
router.get("/", getBusinessProfile);
router.put("/", updateBusinessProfile);

export default router;