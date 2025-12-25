import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* 🔹 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* 🔹 GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* 🔹 UPDATE USER (ADMIN) */
export const updateUserDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update standard fields
    const fields = ["name", "email", "department", "year", "rollNumber", "bio"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Handle Skills (JSON string to Array)
    if (req.body.skills) {
      try {
        const parsed =
          typeof req.body.skills === "string"
            ? JSON.parse(req.body.skills)
            : req.body.skills;
        user.skills = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        user.skills = req.body.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (req.file) user.profilePic = req.file.path;

    // Password override logic
    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

/* 🔹 DELETE USER (ADMIN) */
export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
