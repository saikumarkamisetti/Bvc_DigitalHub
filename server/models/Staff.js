import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    qualification: String,
    subjects: [String],
    experience: String,
    bio: String,
    photo: String, // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
