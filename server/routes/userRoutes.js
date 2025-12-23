import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  completeOnboarding,
  getMyProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();
import { followUser } from "../controllers/userController.js";

router.post("/follow/:id", protect, followUser);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
import upload from "../middleware/upload.js";

router.put(
  "/onboarding",
  protect,
  upload.single("profilePic"), // 👈 THIS IS REQUIRED
  completeOnboarding
);

export default router;
