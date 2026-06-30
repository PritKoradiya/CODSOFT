import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import sampleJobs from "../data/sampleJobs";
import {
  getSavedJobIds,
  saveJobId,
  unsaveJobId,
} from "../utils/savedJobs";

const Home = () => {
  useEffect(() => {
    document.title = "JobNest - Find Your Dream Job";
  }, []);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set(getSavedJobIds()));
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/jobs")
      .then((res) => {
        // Use sample jobs as fallback if API returns empty
        const jobs = res.data.length > 0 ? res.data.slice(0, 6) : sampleJobs;
        setFeaturedJobs(jobs);
      })
      .catch(() => {
        // On error, show sample jobs
        setFeaturedJobs(sampleJobs);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.set("q", searchTitle);
    if (searchLocation) params.set("loc", searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const getInitials = (company) => {
    return (
      company
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "J"
    );
  };

  const toggleSave = useCallback((jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        unsaveJobId(jobId);
      } else {
        next.add(jobId);
        saveJobId(jobId);
      }
      return next;
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>
            Connect with top employers and discover opportunities that match
            your skills and aspirations
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-field">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder="City, state, or remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Find Jobs
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">
                {featuredJobs.length > 0 ? `${featuredJobs.length}+` : "0+"}
              </div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Candidates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Jobs</h2>
          {featuredJobs.length > 0 && (
            <Link to="/jobs" className="view-all">
              View All Jobs
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>

        <div className="category-tags">
          <span className="category-tag active">All Jobs</span>
          <span className="category-tag">Technology</span>
          <span className="category-tag">Design</span>
          <span className="category-tag">Marketing</span>
          <span className="category-tag">Finance</span>
          <span className="category-tag">Remote</span>
        </div>

        <div className="jobs-grid">
          {featuredJobs.map((job) => (
            <Link
              to={`/jobs/${job._id}`}
              key={job._id}
              className="job-card"
            >
              <div className="job-card-header">
                <div className="job-card-logo">
                  {getInitials(job.company)}
                </div>
                <button
                  className={`job-card-save ${
                    savedJobs.has(job._id) ? "saved" : ""
                  }`}
                  onClick={(e) => toggleSave(job._id, e)}
                  title={
                    savedJobs.has(job._id) ? "Unsave job" : "Save job"
                  }
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={
                      savedJobs.has(job._id) ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p className="location">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
              </p>
              <p className="job-card-desc">{job.description}</p>
              <div className="job-card-badges">
                <span
                  className={`badge badge-${
                    job.jobType === "internship"
                      ? "internship"
                      : job.jobType === "part-time"
                      ? "type"
                      : ""
                  }`}
                >
                  {job.jobType}
                </span>
                {job.salary > 0 && (
                  <span className="badge badge-easy-apply">Easy Apply</span>
                )}
              </div>
              <div className="job-card-footer">
                <span className="salary">
                  ${job.salary?.toLocaleString()}/yr
                </span>
                <span className="posted">Just now</span>
              </div>
            </Link>
          ))}
        </div>

        {featuredJobs.length === 0 && (
          <div className="no-results">
            No featured jobs available yet. Check back soon!
          </div>
        )}

        {featuredJobs.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Link to="/jobs" className="btn btn-outline">
              View All Jobs
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
