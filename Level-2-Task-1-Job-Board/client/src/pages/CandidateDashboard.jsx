import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import {
  getSavedJobIds,
  unsaveJobId,
} from "../utils/savedJobs";

const CandidateDashboard = () => {
  useEffect(() => {
    document.title = "My Dashboard - JobNest";
  }, []);

  const [applications, setApplications] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    // Fetch applications
    API.get("/applications")
      .then((res) => {
        // Normalize status: default to "Applied" if backend doesn't provide a status
        const normalized = res.data.map((app) => ({
          ...app,
          status: app.status || "Applied",
        }));
        setApplications(normalized);
      })
      .catch(() => {
        setError("Could not load your applications. Please try again later.");
      })
      .finally(() => setLoading(false));

    // Fetch saved jobs from localStorage, then match with API data
    const savedIds = getSavedJobIds();
    if (savedIds.length > 0) {
      API.get("/jobs")
        .then((res) => {
          const matched = res.data.filter((job) =>
            savedIds.includes(job._id)
          );
          setSavedJobsList(matched);
        })
        .catch(() => {
          // If API fails, we can't resolve saved job details
        });
    }
  }, []);

  const removeSavedJob = (jobId) => {
    unsaveJobId(jobId);
    setSavedJobsList((prev) => prev.filter((j) => j._id !== jobId));
  };

  const statusColors = {
    applied: "#3b82f6",
    pending: "#f59e0b",
    reviewed: "#8b5cf6",
    selected: "#10b981",
    accepted: "#10b981",
    rejected: "#ef4444",
  };

  const getStatusColor = (status) => {
    const key = status?.toLowerCase();
    return statusColors[key] || "#6b7280";
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="container">
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          title="Something went wrong"
          description={error}
          action={
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  const pendingCount = applications.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;
  const reviewedCount = applications.filter(
    (a) => a.status?.toLowerCase() === "reviewed"
  ).length;
  const acceptedCount = applications.filter(
    (a) =>
      a.status?.toLowerCase() === "accepted" ||
      a.status?.toLowerCase() === "selected"
  ).length;

  return (
    <div className="container">
      <div className="dashboard">
        <h2>My Dashboard</h2>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total Applied</div>
            <div className="stat-value">{applications.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Reviewed</div>
            <div className="stat-value">{reviewedCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Accepted</div>
            <div className="stat-value">{acceptedCount}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${
              activeTab === "applications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("applications")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Applied Jobs ({applications.length})
          </button>
          <button
            className={`dashboard-tab ${
              activeTab === "saved" ? "active" : ""
            }`}
            onClick={() => setActiveTab("saved")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Saved Jobs ({savedJobsList.length})
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <>
            {applications.length === 0 ? (
              <EmptyState
                icon={
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
                title="No applications yet"
                description="Start exploring jobs and apply to positions that match your skills."
                action={
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                }
              />
            ) : (
              <div className="jobs-list">
                {applications.map((app) => (
                  <div key={app._id} className="application-card">
                    <div className="app-info">
                      <h3>{app.jobId?.title || "Unknown Position"}</h3>
                      <p>
                        {app.jobId?.company || "Unknown Company"} &middot;{" "}
                        {app.jobId?.location || "Unknown Location"}
                      </p>
                      {app.resumeLink && (
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="app-resume-link"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                    <div className="app-status">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(app.status),
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === "saved" && (
          <>
            {savedJobsList.length === 0 ? (
              <EmptyState
                icon={
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                }
                title="No saved jobs"
                description="Save jobs you're interested in to view them here later."
                action={
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                }
              />
            ) : (
              <div className="jobs-list">
                {savedJobsList.map((job) => (
                  <div key={job._id} className="application-card">
                    <div className="app-info">
                      <h3>
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p>
                        {job.company} &middot; {job.location}
                      </p>
                      <span className="salary" style={{ fontSize: "14px" }}>
                        ${job.salary?.toLocaleString()}/yr
                      </span>
                    </div>
                    <div className="app-status" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className={`badge badge-${job.jobType === "internship" ? "internship" : job.location?.toLowerCase().includes("remote") ? "remote" : "type"}`}>
                        {job.jobType}
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeSavedJob(job._id)}
                        title="Remove from saved"
                        style={{ color: "#ef4444" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
