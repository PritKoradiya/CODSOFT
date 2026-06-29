import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs").then((res) => {
      setJobs(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="jobs-page">
      <h2>All Jobs</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, company, location, or skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="jobs-list">
        {filtered.length === 0 ? (
          <p className="no-results">No jobs found</p>
        ) : (
          filtered.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="job-card-horizontal">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p className="company">{job.company} &middot; {job.location}</p>
                <div className="job-skills">
                  {job.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="badge">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="job-right">
                <span className="salary">${job.salary.toLocaleString()}</span>
                <span className="badge badge-type">{job.jobType}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
