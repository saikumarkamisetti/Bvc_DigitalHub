import express from "express";
import upload from "../middleware/upload.js";

// Import Controllers
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/adminEventController.js";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/adminJobController.js";

import {
  updateUserDetailsAdmin,
  deleteUserAdmin,
} from "../controllers/adminUserController.js";

import {
  getUserProjectsAdmin, // Fetches projects for a specific user ID
  deleteProjectAdmin, // Allows admin to delete a specific project
} from "../controllers/adminProjectController.js";

const router = express.Router();

/* ================= USER MANAGEMENT ================= */
// UPDATE user details (Handles password, profile pic, and info)
router.put("/users/:id", upload.single("profilePic"), updateUserDetailsAdmin);

// DELETE user
router.delete("/users/:id", deleteUserAdmin);

/* ================= PROJECT MANAGEMENT ================= */
// GET all projects for a specific user (Fixes the 404 error)
router.get("/projects/user/:userId", getUserProjectsAdmin);

// DELETE a specific project by ID
router.delete("/projects/:id", deleteProjectAdmin);

/* ================= EVENTS ROUTES ================= */
router.get("/events", getEvents);
router.post("/events", upload.single("banner"), createEvent);
router.put("/events/:id", upload.single("banner"), updateEvent);
router.delete("/events/:id", deleteEvent);

/* ================= JOBS ROUTES ================= */
router.get("/jobs", getJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

export default router;
