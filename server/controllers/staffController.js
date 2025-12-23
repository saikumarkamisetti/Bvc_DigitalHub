export const getStaffById = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    return res.status(404).json({ message: "Faculty not found" });
  }
  res.json(staff);
};
