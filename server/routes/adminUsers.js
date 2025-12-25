import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserDetailsAdmin, // Updated name
  deleteUserAdmin, // Updated name
} from "../controllers/adminUserController.js";
import authAdmin from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.get("/users/:id", authAdmin, getUserById);

// Update route to use the new controller function name
router.put(
  "/users/:id",
  authAdmin,
  upload.single("profilePic"),
  updateUserDetailsAdmin
);

// Update route to use the new controller function name
router.delete("/users/:id", authAdmin, deleteUserAdmin);

export default router;
