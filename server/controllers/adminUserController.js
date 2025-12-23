import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* 🔹 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* 🔹 UPDATE USER */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, ...rest } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  Object.assign(user, rest);

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.json({ message: "User updated successfully" });
};

/* 🔹 DELETE USER */
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
};
