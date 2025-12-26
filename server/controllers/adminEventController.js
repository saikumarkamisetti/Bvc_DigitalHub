import Event from "../models/Event.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
  try {
    // Sort by date ascending (soonest events first)
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE EVENT + EMAIL ================= */
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, category } = req.body;

    // Handle Cloudinary Image Upload
    let banner = "";
    if (req.file) {
      banner = req.file.path; // Cloudinary URL
    }

    const newEvent = new Event({
      title,
      date,
      time,
      location,
      description,
      category,
      banner,
    });

    const savedEvent = await newEvent.save();

    /* ========== EMAIL NOTIFICATION LOGIC ========== */
    const users = await User.find({ email: { $exists: true } }).select("email");
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );
    const allEmails = [
      ...users.map((u) => u.email),
      ...staff.map((s) => s.email),
    ];

    if (allEmails.length > 0) {
      const emailHtml = `
        <div style="font-family:Arial;padding:20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color:#4f46e5">📢 New Event Announced</h2>
          <p><strong>${title}</strong></p>
          <p>${description}</p>
          <p>
            📅 <b>Date:</b> ${new Date(date).toDateString()}<br/>
            ⏰ <b>Time:</b> ${time}<br/>
            📍 <b>Location:</b> ${location}
          </p>
          <p>Please login to <b>BVC Digital Hub</b> for more details.</p>
          <hr style="border:none; border-top: 1px solid #eee; margin: 20px 0;"/>
          <small style="color: #64748b;">This is an automated email from the BVC Admin Panel.</small>
        </div>
      `;

      await sendEmail({
        to: allEmails,
        subject: `📢 New Event: ${title}`,
        html: emailHtml,
      });
    }

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE EVENT + EMAIL (FIXED) ================= */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Update banner only if a new file is uploaded
    if (req.file) {
      updates.banner = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    /* ========== EMAIL NOTIFICATION FOR UPDATE (ADDED) ========== */
    const users = await User.find({ email: { $exists: true } }).select("email");
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );
    const allEmails = [
      ...users.map((u) => u.email),
      ...staff.map((s) => s.email),
    ];

    if (allEmails.length > 0) {
      const emailHtml = `
        <div style="font-family:Arial;padding:20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color:#0891b2">🔄 Event Updated</h2>
          <p>The details for the event <strong>"${
            updatedEvent.title
          }"</strong> have been updated.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
            <p><strong>${updatedEvent.title}</strong></p>
            <p>${updatedEvent.description}</p>
            <p>
              📅 <b>Date:</b> ${new Date(updatedEvent.date).toDateString()}<br/>
              ⏰ <b>Time:</b> ${updatedEvent.time}<br/>
              📍 <b>Location:</b> ${updatedEvent.location}
            </p>
          </div>

          <p>Please login to <b>BVC Digital Hub</b> to view the changes.</p>
          <hr style="border:none; border-top: 1px solid #eee; margin: 20px 0;"/>
          <small style="color: #64748b;">This is an automated update notification.</small>
        </div>
      `;

      await sendEmail({
        to: allEmails,
        subject: `🔄 Updated Event: ${updatedEvent.title}`,
        html: emailHtml,
      });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
