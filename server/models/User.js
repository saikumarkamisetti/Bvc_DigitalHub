import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Identity & Auth
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 🔹 Verification Logic
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,

    // 🔹 Profile & Onboarding
    profilePic: {
      type: String,
      default: "", // Stores Cloudinary URL
    },
    department: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "", // Batch (e.g., "4" or "5")
    },
    rollNumber: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String], // Array of strings for tech stack
      default: [],
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },

    // 🔹 Social Relations
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // Auto-manages createdAt and updatedAt
);

export default mongoose.model("User", userSchema);
