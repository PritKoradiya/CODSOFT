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
      document.title = `${res.data.title} - JobNest`;
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

  const getInitials = (company) => {
    return company?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "J";
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!job) return <div className="loading">Job not found</div>;

  return (
    <div className="job-details">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="detail-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div className="detail-logo">{getInitials(job.company)}</div>
            <div>
              <h2>{job.title}</h2>
              <p className="company">{job.company}</p>
            </div>
          </div>
          <div className="detail-actions">
            <button className="detail-action-btn" title="Save job">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="detail-action-btn" title="Share job">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>

        <p className="location" style={{ marginBottom: "16px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </p>

        <div className="detail-meta">
          <span className="badge">{job.jobType}</span>
          <span className="badge badge-easy-apply">Easy Apply</span>
        </div>

        <div className="detail-salary">
          ${job.salary?.toLocaleString()} <span>/year</span>
        </div>

        <div className="detail-section">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="17" y1="10" x2="3" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="17" y1="18" x2="3" y2="18" />
            </svg>
            Description
          </h3>
          <p>{job.description}</p>
        </div>

        <div className="detail-section">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Required Skills
          </h3>
          <div className="detail-skills">
            {job.skills.map((skill, i) => (
              <span key={i} className="detail-skill">{skill}</span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <p className="detail-posted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Posted by {job.postedBy?.name || "Unknown"}
          </p>
        </div>
      </div>

      {user?.role === "candidate" && (
        <div className="detail-card" style={{ marginTop: "20px" }}>
          <div className="detail-apply-section" style={{ border: "none", padding: 0, margin: 0 }}>
            <h3>Apply for this job</h3>
            {message && (
              <div className={message.includes("success") ? "success-msg" : "error-msg"}>
                {message}
              </div>
            )}
            <form onSubmit={handleApply}>
              <input
                type="url"
                placeholder="Resume link (Google Drive, LinkedIn, etc.)"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                required
              />
              <div className="detail-apply-btns">
                <button type="submit" className="btn btn-primary btn-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!user && (
        <p className="login-prompt">
          <a href="/login">Login</a> as a candidate to apply for this job
        </p>
      )}
    </div>
  );
};

export default JobDetails;
