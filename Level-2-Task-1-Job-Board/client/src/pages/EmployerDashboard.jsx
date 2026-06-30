import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const EmployerDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Employer Dashboard - JobNest";
  }, []);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    API.get("/jobs")
      .then((res) => {
        const myJobs = res.data.filter(
          (j) => j.postedBy?._id === user.id
        );
        setJobs(myJobs);
      })
      .catch(() => {
        setError("Failed to load your jobs. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const fetchApplications = async (jobId) => {
    // Toggle expand/collapse
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);

    // Fetch only if not already loaded
    if (!applications[jobId]) {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        // Normalize status: default to "Applied"
        const normalized = res.data.map((app) => ({
          ...app,
          status: app.status || "Applied",
        }));
        setApplications((prev) => ({ ...prev, [jobId]: normalized }));
      } catch {
        setApplications((prev) => ({
          ...prev,
          [jobId]: [],
        }));
      }
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This action cannot be undone.")) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
      // Clean up applications for deleted job
      setApplications((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    } catch {
      alert("Failed to delete job. Please try again.");
    }
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

  // Calculate total applications across all jobs
  const totalApps = Object.values(applications).reduce(
    (sum, apps) => sum + apps.length,
    0
  );

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Employer Dashboard</h2>
          <Link to="/post-job" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post New Job
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Posted Jobs</div>
            <div className="stat-value">{jobs.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{totalApps}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Listings</div>
            <div className="stat-value">{jobs.length}</div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
            title="No jobs posted yet"
            description="Start attracting great candidates by posting your first job."
            action={
              <Link to="/post-job" className="btn btn-primary">
                Post Your First Job
              </Link>
            }
          />
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job._id} className="job-card-dashboard">
                <div className="job-info">
                  <h3>
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <p className="company">
                    {job.company} &middot; {job.location}
                  </p>
                  <div className="job-meta">
                    <span className="badge">{job.jobType}</span>
                    <span className="salary">
                      ${job.salary?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="job-actions">
                  <button
                    className={`btn btn-sm ${
                      expandedJob === job._id ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => fetchApplications(job._id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {expandedJob === job._id ? "Hide" : "View"} Applicants
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(job._id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>

                {/* Applicants List */}
                {expandedJob === job._id && (
                  <div className="applications-list">
                    <h4>
                      Applicants
                      {applications[job._id] && (
                        <span className="applicant-count">
                          ({applications[job._id].length})
                        </span>
                      )}
                    </h4>
                    {!applications[job._id] ? (
                      <p className="loading-inline">Loading applicants...</p>
                    ) : applications[job._id].length === 0 ? (
                      <p className="no-applicants">
                        No applications received yet.
                      </p>
                    ) : (
                      applications[job._id].map((app) => (
                        <div key={app._id} className="application-item">
                          <div>
                            <strong>
                              {app.candidateId?.name || "Unknown Candidate"}
                            </strong>
                            <span>{app.candidateId?.email}</span>
                          </div>
                          <div className="application-item-actions">
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(app.status),
                              }}
                            >
                              {app.status}
                            </span>
                            {app.resumeLink && (
                              <a
                                href={app.resumeLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline btn-sm"
                              >
                                Resume
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
