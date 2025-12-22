import bcrypt from "bcryptjs";
import User from "../models/User.js";
import transporter from "../config/mail.js";
import jwt from "jsonwebtoken";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ College email validation
    // if (!email.endsWith("@bvcgroup.in")) {
    //   return res.status(400).json({
    //     message: "Use only @bvcgroup.in email",
    //   });
    // }

    // 2️⃣ Existing user check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = generateOTP();

    // 5️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // 6️⃣ Send OTP mail
    try {
  await transporter.sendMail({
    from: process.env.MAIL_USER || "no-reply@bvcdigitalhub.com",
    to: email,
    subject: "BVC DigitalHub OTP Verification",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
} catch (mailError) {
  console.error("Mail failed:", mailError.message);
}


    res.status(201).json({
      message: "Signup successful. OTP sent to email.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    // 3️⃣ OTP match
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // 4️⃣ OTP expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }
    

    // 5️⃣ Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
  message: "OTP verified",
  isOnboarded: user.isOnboarded
});
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Check OTP verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify OTP before login",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
