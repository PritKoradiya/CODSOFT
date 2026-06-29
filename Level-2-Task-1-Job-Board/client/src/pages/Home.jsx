import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs").then((res) => setFeaturedJobs(res.data.slice(0, 6)));
  }, []);

  return (
    <div className="home">
      <section className="hero-section">
        <h1>Find Your Dream Job</h1>
        <p>Connect with top employers and discover opportunities that match your skills</p>
        <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs</Link>
      </section>

      <section className="featured-section">
        <h2>Featured Jobs</h2>
        <div className="jobs-grid">
          {featuredJobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p className="location">{job.location}</p>
              <div className="job-meta">
                <span className="badge">{job.jobType}</span>
                <span className="salary">${job.salary.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
        {featuredJobs.length > 0 && (
          <Link to="/jobs" className="btn btn-outline">View All Jobs</Link>
        )}
      </section>
    </div>
  );
};

export default Home;
