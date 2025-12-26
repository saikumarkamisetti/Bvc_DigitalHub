import Job from "../models/Job.js";
import User from "../models/User.js"; // ✅ Students
import Staff from "../models/Staff.js"; // ✅ Staff
import { sendEmail } from "../utils/sendEmail.js"; // ✅ Email helper

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    // Sort by creation date descending (newest first)
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE JOB (WITH EMAIL) =================
export const createJob = async (req, res) => {
  try {
    // 🔹 Save Job
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    // 🔹 Fetch all student + staff emails
    const students = await User.find({}, "email");
    const staff = await Staff.find({}, "email");

    const emailList = [
      ...students.map((s) => s.email),
      ...staff.map((f) => f.email),
    ].filter(Boolean);

    // 🔹 Send Email Notification
    if (emailList.length > 0) {
      await sendEmail({
        to: emailList,
        subject: `📢 New Job Opportunity: ${savedJob.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6">
            <h2 style="color:#2563eb">${savedJob.title}</h2>
            <p><strong>Company:</strong> ${savedJob.company}</p>
            <p><strong>Location:</strong> ${savedJob.location}</p>
            <p><strong>Job Type:</strong> ${savedJob.type}</p>
            ${
              savedJob.salary
                ? `<p><strong>Salary:</strong> ${savedJob.salary}</p>`
                : ""
            }
            <p><strong>Deadline:</strong> ${
              savedJob.deadline
                ? new Date(savedJob.deadline).toDateString()
                : "Not specified"
            }</p>
            <p>${savedJob.description}</p>
            ${
              savedJob.link
                ? `<p><a href="${savedJob.link}" target="_blank">Apply Here</a></p>`
                : ""
            }
            <hr/>
            <p style="font-size:12px;color:#6b7280">
              Career Portal | This is an automated notification
            </p>
          </div>
        `,
      });
    }

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Job creation failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= UPDATE JOB (WITH EMAIL) =================
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔹 Fetch all student + staff emails for update notification
    const students = await User.find({}, "email");
    const staff = await Staff.find({}, "email");

    const emailList = [
      ...students.map((s) => s.email),
      ...staff.map((f) => f.email),
    ].filter(Boolean);

    // 🔹 Send Email Notification for Update
    if (emailList.length > 0) {
      await sendEmail({
        to: emailList,
        subject: `🔄 Updated Job Opportunity: ${updatedJob.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6">
            <h2 style="color:#2563eb">Updated: ${updatedJob.title}</h2>
            <p>Details for this job posting have been updated.</p>
            <p><strong>Company:</strong> ${updatedJob.company}</p>
            <p><strong>Location:</strong> ${updatedJob.location}</p>
            <p><strong>Job Type:</strong> ${updatedJob.type}</p>
            ${
              updatedJob.salary
                ? `<p><strong>Salary:</strong> ${updatedJob.salary}</p>`
                : ""
            }
            <p><strong>Deadline:</strong> ${
              updatedJob.deadline
                ? new Date(updatedJob.deadline).toDateString()
                : "Not specified"
            }</p>
            <p>${updatedJob.description}</p>
            ${
              updatedJob.link
                ? `<p><a href="${updatedJob.link}" target="_blank">Apply Here</a></p>`
                : ""
            }
            <hr/>
            <p style="font-size:12px;color:#6b7280">
              Career Portal | This is an automated notification regarding a job update
            </p>
          </div>
        `,
      });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Job update failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
