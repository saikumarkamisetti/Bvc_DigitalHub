import Project from "../models/Project.js";

// 🔹 Create project
export const createProject = async (req, res) => {
  try {
    const media = req.files?.map((file) => file.path) || [];

    const project = await Project.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      repoLink: req.body.repoLink,
      techStack: req.body.techStack?.split(",") || [],
      media,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Project creation failed" });
  }
};


export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("user", "name email department profilePic");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};


// 🔹 Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

// 🔹 Get projects by user
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user projects",
    });
  }
};

// 🔹 Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can delete
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Project deletion failed",
    });
  }
};

// ❤️ Like project (one time)
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prevent multiple likes
    if (project.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    project.likes.push(req.user._id);
    await project.save();

    res.status(200).json({
      message: "Project liked",
      likesCount: project.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Like failed" });
  }
};
