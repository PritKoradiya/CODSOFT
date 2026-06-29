import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const PostJob = () => {
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
        {error && <div className="error-msg">{error}</div>}

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Annual Salary"
          value={formData.salary}
          onChange={handleChange}
          required
          min={0}
        />
        <select name="jobType" value={formData.jobType} onChange={handleChange}>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated: React, Node.js, MongoDB)"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
