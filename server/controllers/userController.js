import User from "../models/User.js";

// 🔹 Get logged-in user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};



export const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { department, year, rollNumber, bio, skills } = req.body;

    user.department = department;
    user.year = year;
    user.rollNumber = rollNumber;
    user.bio = bio;
    user.skills = skills;
    user.isOnboarded = true;

    // ✅ PROFILE PIC FROM CLOUDINARY
    if (req.file) {
      user.profilePic = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.json({
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Onboarding failed",
      error: error.message,
    });
  }
};



// 🔹 Update profile (onboarding + edit)
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
    });
  }
};

// 👤 Follow / Unfollow user
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cannot follow yourself
    if (req.user._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const isFollowing = req.user.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      req.user.following.pull(userToFollow._id);
      userToFollow.followers.pull(req.user._id);
    } else {
      // Follow
      req.user.following.push(userToFollow._id);
      userToFollow.followers.push(req.user._id);
    }

    await req.user.save();
    await userToFollow.save();

    res.status(200).json({
      message: isFollowing ? "Unfollowed" : "Followed",
    });
  } catch (error) {
    res.status(500).json({ message: "Follow action failed" });
  }
};
