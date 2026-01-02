import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Client Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";

// Admin Routes
import adminAuthRoutes from "./routes/adminAuth.js";
import adminUserRoutes from "./routes/adminUsers.js";
import adminStaffRoutes from "./routes/adminStaff.js";
import adminRoutes from "./routes/adminRoutes.js";

// Initialize Database
connectDB();

const app = express();

// ✅ 1. FIXED CORS: Allow both local testing and your live Vercel URL
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://bvc-digital-hub.vercel.app", // 👈 Replace with your ACTUAL Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ 2. ADDED ROOT ROUTE: Fixes the "Cannot GET /" message on Render
app.get("/", (req, res) => {
  res.status(200).send("BVC Digital Hub API is running successfully!");
});

// --- ADMIN API ENDPOINTS ---
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminUserRoutes);

// --- CLIENT API ENDPOINTS ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/info", infoRoutes);

// ✅ 3. DYNAMIC PORT: Render assigns a port automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
