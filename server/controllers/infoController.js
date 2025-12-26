import Staff from "../models/Staff.js";
import Event from "../models/Event.js";
import Job from "../models/Job.js";
import User from "../models/User.js"; // ✅ Added for student count
import nodemailer from "nodemailer";

// 📊 Get dashboard stats (Public)
export const getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments();
    const staffCount = await Staff.countDocuments();

    res.status(200).json({
      students: studentCount,
      staff: staffCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// 👨‍🏫 Get all staff
export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ department: 1 });
    res.status(200).json(staff);
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

// 🎉 Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// 💼 Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to load event" });
  }
};

export const applyForJob = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BVC Digital Hub" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Job Application Submitted Successfully",
      html: `
        <h2>Application Received</h2>
        <p>Dear ${name},</p>

        <p>Thank you for applying through <b>BVC Digital Hub</b>.</p>

        <p>Your application has been submitted successfully.</p>

        <p><b>Contact Number:</b> ${phone}</p>

        <p>Our team will review your profile and contact you if shortlisted.</p>

        <br />
        <p>Best Regards,<br/>
        <b>BVC Digital Hub Placement Team</b></p>
      `,
    });

    res.json({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email" });
  }
};
