import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/", adminAuth, getAllUsers);
router.put("/:id", adminAuth, updateUser);
router.delete("/:id", adminAuth, deleteUser);

export default router;
