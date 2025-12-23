import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/mail.js";

/* ===============================
   HELPERS
================================ */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email) => email?.toLowerCase().trim();

const isCollegeEmail = (email) => email.endsWith("@bvcgroup.in");

/* ===============================
   SIGNUP
================================ */
export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = normalizeEmail(email);

    // 🔒 College email restriction
    if (!email || !isCollegeEmail(email)) {
      return res.status(400).json({
        message: "Only @bvcgroup.in email addresses are allowed",
      });
    }

    // Existing user check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
      isVerified: false,
      isOnboarded: false,
    });

    // Send OTP email
    try {
      await transporter.sendMail({
        from: `"BVC DigitalHub" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "OTP Verification - BVC DigitalHub",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      });
    } catch (mailError) {
      // rollback user if mail fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Failed to send OTP email",
      });
    }

    res.status(201).json({
      message: "Signup successful. OTP sent to college email.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

/* ===============================
   VERIFY OTP
================================ */
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = normalizeEmail(email);

    if (!email || !isCollegeEmail(email)) {
      return res.status(400).json({
        message: "Invalid college email address",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "OTP verified successfully",
    token, // ✅ IMPORTANT
  });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

/* ===============================
   LOGIN
================================ */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = normalizeEmail(email);

    // 🔒 College email only
    if (!email || !isCollegeEmail(email)) {
      return res.status(400).json({
        message: "Only @bvcgroup.in email addresses are allowed",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please sign up.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify OTP before login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
