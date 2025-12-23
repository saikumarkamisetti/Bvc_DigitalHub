import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "bvc_projects";

    // 👇 if onboarding / profile update
    if (req.baseUrl.includes("users")) {
      folder = "bvc_users";
    }

    return {
      folder,
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
