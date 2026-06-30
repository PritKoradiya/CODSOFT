import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import sampleJobs from "../data/sampleJobs";
import {
  getSavedJobIds,
  saveJobId,
  unsaveJobId,
} from "../utils/savedJobs";

const Jobs = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Browse Jobs - JobNest";
  }, []);
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("loc") || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Filter states
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    remote: false,
    onSite: false,
    internship: false,
    salaryMin: "",
    salaryMax: "",
  });

  const [savedJobs, setSavedJobs] = useState(new Set(getSavedJobIds()));
  const [resumeLink, setResumeLink] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    API.get("/jobs")
      .then((res) => {
        if (!cancelled) {
          const apiJobs = res.data;
          if (Array.isArray(apiJobs) && apiJobs.length > 0) {
            setJobs(apiJobs);
          } else {
            setJobs(sampleJobs);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJobs(sampleJobs);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      remote: false,
      onSite: false,
      internship: false,
      salaryMin: "",
      salaryMax: "",
    });
    setLocationFilter("");
    setSearch("");
  };

  const filtered = jobs.filter((job) => {
    // Keyword search (title, company, skills, description)
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q) ||
      job.skills?.some((s) => s.toLowerCase().includes(q));

    // Location search
    const loc = locationFilter.toLowerCase();
    const matchesLocation =
      !loc || job.location?.toLowerCase().includes(loc);

    // Job type filters
    const anyTypeSelected =
      filters.fullTime ||
      filters.partTime ||
      filters.remote ||
      filters.onSite ||
      filters.internship;

    const matchesType =
      !anyTypeSelected ||
      (filters.fullTime && job.jobType === "full-time") ||
      (filters.partTime && job.jobType === "part-time") ||
      (filters.internship && job.jobType === "internship") ||
      (filters.remote &&
        job.location?.toLowerCase().includes("remote")) ||
      (filters.onSite &&
        !job.location?.toLowerCase().includes("remote"));

    // Salary range
    const matchesSalary =
      (!filters.salaryMin ||
        job.salary >= Number(filters.salaryMin)) &&
      (!filters.salaryMax ||
        job.salary <= Number(filters.salaryMax));

    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "salary-high") return b.salary - a.salary;
    if (sortBy === "salary-low") return a.salary - b.salary;
    return 0;
  });

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

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplyMessage("");
    setApplying(true);
    try {
      await API.post("/applications", {
        jobId: selectedJob._id,
        resumeLink,
      });
      setApplyMessage("Application submitted successfully!");
      setResumeLink("");
    } catch (err) {
      setApplyMessage(
        err.response?.data?.message || "Failed to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  const activeFilterCount =
    (filters.fullTime ? 1 : 0) +
    (filters.partTime ? 1 : 0) +
    (filters.remote ? 1 : 0) +
    (filters.onSite ? 1 : 0) +
    (filters.internship ? 1 : 0) +
    (filters.salaryMin ? 1 : 0) +
    (filters.salaryMax ? 1 : 0);

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
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="jobs-page-header">
        <h2>Find Your Perfect Job</h2>
        <p>{filtered.length} jobs available</p>
      </div>

      <div className="jobs-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-card">
            <h3>
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
              <button onClick={clearFilters}>Clear All</button>
            </h3>

            {/* Keyword Search in Sidebar */}
            <div className="filter-group">
              <label>Keyword</label>
              <input
                type="text"
                className="filter-text-input"
                placeholder="e.g. React, Python, Designer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Location Search in Sidebar */}
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                className="filter-text-input"
                placeholder="e.g. New York, Remote"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Job Type</label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.fullTime}
                  onChange={() => handleFilterChange("fullTime")}
                />
                <span className="filter-label-text">Full-time</span>
                <span className="count">
                  {jobs.filter((j) => j.jobType === "full-time").length}
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.partTime}
                  onChange={() => handleFilterChange("partTime")}
                />
                <span className="filter-label-text">Part-time</span>
                <span className="count">
                  {jobs.filter((j) => j.jobType === "part-time").length}
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.internship}
                  onChange={() => handleFilterChange("internship")}
                />
                <span className="filter-label-text">Internship</span>
                <span className="count">
                  {jobs.filter((j) => j.jobType === "internship").length}
                </span>
              </label>
            </div>

            <div className="filter-group">
              <label>Work Mode</label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={() => handleFilterChange("remote")}
                />
                <span className="filter-label-text">Remote</span>
                <span className="count">
                  {jobs.filter((j) =>
                    j.location?.toLowerCase().includes("remote")
                  ).length}
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.onSite}
                  onChange={() => handleFilterChange("onSite")}
                />
                <span className="filter-label-text">On-site</span>
                <span className="count">
                  {jobs.filter(
                    (j) => !j.location?.toLowerCase().includes("remote")
                  ).length}
                </span>
              </label>
            </div>

            <div className="filter-group">
              <label>Salary Range</label>
              <div className="salary-range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.salaryMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      salaryMin: e.target.value,
                    }))
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.salaryMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      salaryMax: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="job-results">
          {/* Search Bar */}
          <div className="jobs-search">
            <div className="jobs-search-wrap">
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
                className="jobs-search-input"
                placeholder="Search jobs by title, company, location, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="job-results-header">
            <span className="result-count">
              Showing <strong>{sorted.length}</strong> of {jobs.length} jobs
            </span>
            <div className="job-sort">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          <div className="jobs-list">
            {sorted.length === 0 ? (
              <EmptyState
                title="No jobs found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              sorted.map((job) => (
                <div
                  key={job._id}
                  className={`job-card-horizontal ${
                    selectedJob?._id === job._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <p className="location">
                      <svg
                        width="13"
                        height="13"
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
                    <div className="job-skills">
                      {job.skills?.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="badge">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                    <p className="job-card-desc-short">{job.description}</p>
                  </div>
                  <div className="job-right">
                    <span className="salary">
                      ${job.salary?.toLocaleString()}/yr
                    </span>
                    <span
                      className={`badge badge-${
                        job.jobType === "internship"
                          ? "internship"
                          : job.location?.toLowerCase().includes("remote")
                          ? "remote"
                          : "type"
                      }`}
                    >
                      {job.jobType}
                    </span>
                    <span className="badge badge-easy-apply">Easy Apply</span>
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
                        width="16"
                        height="16"
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* Job Detail Panel */}
        <div
          className={`job-detail-panel ${
            !selectedJob ? "empty-state-detail" : ""
          }`}
        >
          {!selectedJob ? (
            <>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <p>Select a job to view details</p>
              <span>Click on any job card from the list</span>
            </>
          ) : (
            <>
              <div className="detail-header">
                <div className="detail-header-top">
                  <div className="detail-logo">
                    {getInitials(selectedJob.company)}
                  </div>
                  <div className="detail-actions">
                    <button
                      className={`detail-action-btn ${
                        savedJobs.has(selectedJob._id) ? "saved" : ""
                      }`}
                      onClick={(e) => toggleSave(selectedJob._id, e)}
                      title={
                        savedJobs.has(selectedJob._id)
                          ? "Unsave job"
                          : "Save job"
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={
                          savedJobs.has(selectedJob._id)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                    <button className="detail-action-btn" title="Share job">
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
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h2>{selectedJob.title}</h2>
                <p className="detail-company">{selectedJob.company}</p>
                <p className="detail-location">
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
                  {selectedJob.location}
                </p>
                <div className="detail-meta">
                  <span
                    className={`badge badge-${
                      selectedJob.jobType === "internship"
                        ? "internship"
                        : selectedJob.location
                            ?.toLowerCase()
                            .includes("remote")
                        ? "remote"
                        : ""
                    }`}
                  >
                    {selectedJob.jobType}
                  </span>
                  <span className="badge badge-easy-apply">Easy Apply</span>
                </div>
                <div className="detail-salary">
                  ${selectedJob.salary?.toLocaleString()} <span>/year</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>
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
                    <line x1="17" y1="10" x2="3" y2="10" />
                    <line x1="21" y1="6" x2="3" y2="6" />
                    <line x1="21" y1="14" x2="3" y2="14" />
                    <line x1="17" y1="18" x2="3" y2="18" />
                  </svg>
                  Job Description
                </h3>
                <p>{selectedJob.description}</p>
              </div>

              <div className="detail-section">
                <h3>
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
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  Required Skills
                </h3>
                <div className="detail-skills">
                  {selectedJob.skills?.map((skill, i) => (
                    <span key={i} className="detail-skill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <p className="detail-posted">
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
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Posted by {selectedJob.postedBy?.name || "Unknown"}
                </p>
              </div>

              {user?.role === "candidate" && (
                <div className="detail-apply-section">
                  <h3>Apply for this job</h3>
                  {applyMessage && (
                    <div
                      className={
                        applyMessage.includes("success")
                          ? "success-msg"
                          : "error-msg"
                      }
                    >
                      {applyMessage}
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
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={applying}
                      >
                        {applying ? "Submitting..." : "Apply Now"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() =>
                          toggleSave(selectedJob._id, {
                            stopPropagation: () => {},
                          })
                        }
                      >
                        {savedJobs.has(selectedJob._id)
                          ? "Saved"
                          : "Save Job"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {!user && (
                <div className="detail-apply-section">
                  <p className="login-prompt">
                    <a href="/login">Login</a> as a candidate to apply for
                    this job
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
