const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const router = express.Router();

// POST /api/applications - Apply for a job (candidate only)
router.post("/", auth, allowRoles("candidate"), async (req, res) => {
  try {
    const { jobId, resumeLink } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({ jobId, candidateId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user.id,
      resumeLink,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/applications - Get candidate's own applications (candidate only)
router.get("/", auth, allowRoles("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate("jobId", "title company location")
      .populate("candidateId", "name email");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/applications/job/:jobId - Get applications for a job (recruiter only, own jobs)
router.get("/job/:jobId", auth, allowRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("candidateId", "name email")
      .populate("jobId", "title company");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
