import Project from "../models/Project.js";

export const getUserProjectsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ user: userId });
    res.status(200).json(projects || []);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: error.message });
  }
};

export const deleteProjectAdmin = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted by Admin" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};
