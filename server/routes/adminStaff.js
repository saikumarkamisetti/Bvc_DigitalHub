import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";
import {
  addStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/adminStaffController.js";

const router = express.Router();

router.get("/", adminAuth, getAllStaff);
router.post("/", adminAuth, upload.single("photo"), addStaff);
router.put("/:id", adminAuth, upload.single("photo"), updateStaff);
router.delete("/:id", adminAuth, deleteStaff);

export default router;
