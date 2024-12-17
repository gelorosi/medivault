import express from "express";
import {
  register,
  login,
  getProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);  // Changed from /profile to /me
router.put("/change-password", protect, changePassword);

export default router;