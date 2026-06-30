const SAVED_JOBS_KEY = "jobnest_saved_jobs";

// Get saved job IDs from localStorage
export const getSavedJobIds = () => {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save a job ID to localStorage
export const saveJobId = (jobId) => {
  const ids = getSavedJobIds();
  if (!ids.includes(jobId)) {
    ids.push(jobId);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  }
};

// Remove a job ID from localStorage
export const unsaveJobId = (jobId) => {
  const ids = getSavedJobIds().filter((id) => id !== jobId);
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
};

// Check if a job is saved
export const isJobSaved = (jobId) => {
  return getSavedJobIds().includes(jobId);
};

// Get full job objects for saved jobs (needs the jobs array)
export const getSavedJobs = (allJobs) => {
  const ids = getSavedJobIds();
  return allJobs.filter((job) => ids.includes(job._id));
};
