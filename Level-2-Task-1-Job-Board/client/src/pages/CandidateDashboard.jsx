import { useEffect, useState } from "react";
import API from "../api/axios";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications").then((res) => {
      setApplications(res.data);
      setLoading(false);
    });
  }, []);

  const statusColors = {
    pending: "#f59e0b",
    reviewed: "#3b82f6",
    accepted: "#10b981",
    rejected: "#ef4444",
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="app-info">
                <h3>{app.jobId?.title}</h3>
                <p>{app.jobId?.company} &middot; {app.jobId?.location}</p>
              </div>
              <div className="app-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[app.status] }}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
