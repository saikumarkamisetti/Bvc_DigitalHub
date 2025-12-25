import User from "../models/User.js";

// 🔹 Get logged-in user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 🔹 Update profile (Handles Onboarding + Regular Edits)
export const updateProfile = async (req, res) => {
  try {
    // 1. Locate the user from auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ CRITICAL FIX: Check if req.body exists before destructuring.
    // If req.body is undefined, it means Multer middleware is missing in the route.
    if (!req.body) {
      console.error(
        "ERROR: req.body is undefined. Ensure upload.single() is used in the route."
      );
      return res
        .status(400)
        .json({ message: "No data received by the server." });
    }

    // 2. Destructure fields from req.body
    const { name, department, year, rollNumber, bio, skills } = req.body;

    // 3. Explicitly update text fields
    // String(year) handles the update from Batch 4 to 5 precisely
    if (name) user.name = name;
    if (department) user.department = department;
    if (year) user.year = String(year);
    if (rollNumber) user.rollNumber = rollNumber;

    // Check for undefined to allow clearing bio if needed
    if (bio !== undefined) user.bio = bio;

    // 4. Robust Skills Parsing
    // Safely handles JSON strings from FormData or raw comma-separated text
    if (skills) {
      if (typeof skills === "string") {
        try {
          const parsed = JSON.parse(skills);
          user.skills = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          // Fallback parsing for plain comma-separated strings
          user.skills = skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } else if (Array.isArray(skills)) {
        user.skills = skills;
      }
    }

    // 5. Handle Profile Picture (Updated path from Multer)
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // 6. Save changes
    user.isOnboarded = true;
    const updatedUser = await user.save();

    // 7. Remove sensitive data for the response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile updated successfully ✨",
      user: userResponse,
    });
  } catch (error) {
    // Detailed server log to catch the specific field causing 500 errors
    console.error("CRITICAL SERVER UPDATE ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error during update",
      error: error.message,
    });
  }
};

// 🔹 Note: completeOnboarding uses the same logic
export const completeOnboarding = updateProfile;

// 👤 Follow / Unfollow user
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-following
    if (req.user._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const isFollowing = req.user.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow logic
      req.user.following.pull(userToFollow._id);
      userToFollow.followers.pull(req.user._id);
    } else {
      // Follow logic
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
