const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const router = express.Router();

// POST /api/jobs - Create a job (recruiter only)
router.post("/", auth, allowRoles("recruiter"), async (req, res) => {
  try {
    const { title, company, location, salary, jobType, description, skills } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      description,
      skills,
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs - Get all jobs (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/:id - Get single job (public)
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/jobs/:id - Update a job (recruiter, own jobs only)
router.put("/:id", auth, allowRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/jobs/:id - Delete a job (recruiter, own jobs only)
router.delete("/:id", auth, allowRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
