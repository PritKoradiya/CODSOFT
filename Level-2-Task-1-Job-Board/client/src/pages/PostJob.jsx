import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const PostJob = () => {
  useEffect(() => {
    document.title = "Post a Job - JobNest";
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "full-time",
    description: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/jobs", {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      navigate("/employer");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>
        <p className="auth-subtitle">Fill in the details to attract great candidates</p>
        {error && <div className="error-msg">{error}</div>}

        <label>Job Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Senior React Developer"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Company Name</label>
        <input
          type="text"
          name="company"
          placeholder="e.g. TechCorp Inc."
          value={formData.company}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="e.g. San Francisco, CA or Remote"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Annual Salary ($)</label>
        <input
          type="number"
          name="salary"
          placeholder="e.g. 85000"
          value={formData.salary}
          onChange={handleChange}
          required
          min={0}
        />

        <label>Job Type</label>
        <select name="jobType" value={formData.jobType} onChange={handleChange}>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>

        <label>Job Description</label>
        <textarea
          name="description"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
        />

        <label>Required Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          placeholder="e.g. React, Node.js, MongoDB"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block btn-lg">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
