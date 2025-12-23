import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getAllProjects,
  getMyProjects,
  deleteProject,
  getProjectById,
} from "../controllers/projectController.js";
import upload from "../middleware/upload.js";
const router = express.Router();
import { likeProject } from "../controllers/projectController.js";

router.post("/:id/like", protect, likeProject);
router.post(
  "/",
  protect,
  upload.array("media", 5),
  createProject
);
router.get("/", protect, getAllProjects);
router.get("/my", protect, getMyProjects);
router.delete("/:id", protect, deleteProject);
router.get("/:id", protect, getProjectById);



export default router;
