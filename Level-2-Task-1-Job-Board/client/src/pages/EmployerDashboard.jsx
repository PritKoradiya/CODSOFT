import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs").then((res) => {
      const myJobs = res.data.filter((j) => j.postedBy?._id === user.id);
      setJobs(myJobs);
      setLoading(false);
    });
  }, [user.id]);

  const fetchApplications = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplications((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Employer Dashboard</h2>
        <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card-dashboard">
              <div className="job-info">
                <h3><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3>
                <p>{job.company} &middot; {job.location}</p>
                <div className="job-meta">
                  <span className="badge">{job.jobType}</span>
                  <span className="salary">${job.salary.toLocaleString()}</span>
                </div>
              </div>
              <div className="job-actions">
                <button className="btn btn-outline btn-sm" onClick={() => fetchApplications(job._id)}>
                  View Applications
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>
                  Delete
                </button>
              </div>

              {applications[job._id] && (
                <div className="applications-list">
                  <h4>Applications ({applications[job._id].length})</h4>
                  {applications[job._id].length === 0 ? (
                    <p className="no-results">No applications yet</p>
                  ) : (
                    applications[job._id].map((app) => (
                      <div key={app._id} className="application-item">
                        <div>
                          <strong>{app.candidateId?.name}</strong>
                          <span>{app.candidateId?.email}</span>
                        </div>
                        <a href={app.resumeLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                          Resume
                        </a>
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
  );
};

export default EmployerDashboard;
