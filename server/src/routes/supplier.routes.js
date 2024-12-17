import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createSupplier).get(protect, getSuppliers);

router
  .route("/:id")
  .get(protect, getSupplier)
  .put(protect, updateSupplier)
  .delete(protect, deleteSupplier);

export default router;
