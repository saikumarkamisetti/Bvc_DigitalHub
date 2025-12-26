import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getStaff,
  getEvents,
  getJobs,
  getEventById,
  getStats, // ✅ Ensure this is exported from your controller
} from "../controllers/infoController.js";
import { getStaffById } from "../controllers/staffController.js";
import { applyForJob } from "../controllers/infoController.js";

const router = express.Router();

// --- NEW PUBLIC ROUTES ---
/**
 * This route provides the counts for students and staff.
 * It is public so the Home page can load it without a 403 error.
 */
router.get("/stats", getStats);

// --- EXISTING ROUTES ---
router.post("/jobs/:id/apply", applyForJob);

router.get("/staff", protect, getStaff);
router.get("/events", protect, getEvents);
router.get("/jobs", protect, getJobs);
router.get("/staff/:id", protect, getStaffById);
router.get("/events/:id", getEventById);

export default router;
