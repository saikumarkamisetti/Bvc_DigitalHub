import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: String,

    otpExpiry: Date,
    // 🔽 Onboarding fields
    profilePic: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
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
      type: [String],
      default: [],
    },

    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    otp: String,
    otpExpiry: Date,
    isOnboarded: {
  type: Boolean,
  default: false
},
profilePic: {
  type: String,
  default: "",
}

  
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
