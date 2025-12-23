import Staff from "../models/Staff.js";

/* ➕ ADD STAFF */
export const addStaff = async (req, res) => {
  try {
    const staff = await Staff.create({
      ...req.body,
      photo: req.file?.path || "",
    });

    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to add staff" });
  }
};

/* 📄 GET ALL STAFF */
export const getAllStaff = async (req, res) => {
  const staff = await Staff.find().sort({ createdAt: -1 });
  res.json(staff);
};

/* ✏️ UPDATE STAFF */
export const updateStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: "Not found" });

  Object.assign(staff, req.body);
  if (req.file) staff.photo = req.file.path;

  await staff.save();
  res.json({ message: "Staff updated" });
};

/* 🗑️ DELETE STAFF */
export const deleteStaff = async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Staff deleted" });
};
