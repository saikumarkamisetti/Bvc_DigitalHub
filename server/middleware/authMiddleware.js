import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js"; // ✅ Added: Import Admin model

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Get account (exclude password)
      // First, try to find the ID in the regular User collection
      req.user = await User.findById(decoded.id).select("-password");

      // ✅ FIX: If not found in User, search the Admin collection
      if (!req.user) {
        req.user = await Admin.findById(decoded.id).select("-password");
      }

      // 4️⃣ Final Check
      if (!req.user) {
        return res.status(401).json({ message: "Account not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

export default protect;
