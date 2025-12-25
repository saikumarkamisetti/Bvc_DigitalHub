import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // Standardized import position
import {
  completeOnboarding,
  getMyProfile,
  updateProfile,
  followUser,
} from "../controllers/userController.js";

const router = express.Router();

/* 🔹 GET PROFILE */
router.get("/me", protect, getMyProfile);

/* 🔹 UPDATE PROFILE (Regular Edit) */
// ✅ FIXED: Added upload.single("profilePic") to parse FormData
router.put("/me", protect, upload.single("profilePic"), updateProfile);

/* 🔹 ONBOARDING */
router.put(
  "/onboarding",
  protect,
  upload.single("profilePic"),
  completeOnboarding
);

/* 🔹 SOCIAL ACTION */
router.post("/follow/:id", protect, followUser);

export default router;
