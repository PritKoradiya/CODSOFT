import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/jobs/${id}`).then((res) => {
      setJob(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/applications", { jobId: id, resumeLink });
      setMessage("Application submitted successfully!");
      setResumeLink("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!job) return <div className="loading">Job not found</div>;

  return (
    <div className="job-details">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>Back</button>

      <div className="detail-card">
        <h2>{job.title}</h2>
        <p className="company">{job.company}</p>
        <p className="location">{job.location}</p>

        <div className="detail-meta">
          <span className="badge">{job.jobType}</span>
          <span className="salary">${job.salary.toLocaleString()}/year</span>
        </div>

        <div className="detail-section">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="detail-section">
          <h3>Required Skills</h3>
          <div className="job-skills">
            {job.skills.map((skill, i) => (
              <span key={i} className="badge">{skill}</span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <p className="posted-by">Posted by: {job.postedBy?.name}</p>
        </div>
      </div>

      {user?.role === "candidate" && (
        <div className="apply-section">
          <h3>Apply for this job</h3>
          {message && <div className={message.includes("success") ? "success-msg" : "error-msg"}>{message}</div>}
          <form onSubmit={handleApply}>
            <input
              type="url"
              placeholder="Resume link (Google Drive, etc.)"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Submit Application</button>
          </form>
        </div>
      )}

      {!user && (
        <p className="login-prompt">
          <a href="/login">Login</a> as a candidate to apply
        </p>
      )}
    </div>
  );
};

export default JobDetails;
