import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createProduct).get(protect, getProducts);

router.get("/low-stock", protect, getLowStockProducts);

router.patch("/:id/stock", protect, updateStock);

router
  .route("/:id")
  .get(protect, getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
