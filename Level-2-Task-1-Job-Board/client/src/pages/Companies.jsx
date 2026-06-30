import { useState, useEffect } from "react";

const companies = [
  {
    id: 1,
    name: "TechNova Solutions",
    industry: "IT Services",
    location: "Bengaluru",
    openJobs: 12,
    description:
      "Leading IT services company specializing in cloud solutions, enterprise software, and digital transformation for global clients.",
    logo: "TN",
    color: "#2563eb",
  },
  {
    id: 2,
    name: "CodeCraft Labs",
    industry: "Software Development",
    location: "Pune",
    openJobs: 8,
    description:
      "Innovative software development firm building cutting-edge web and mobile applications using modern tech stacks.",
    logo: "CC",
    color: "#7c3aed",
  },
  {
    id: 3,
    name: "CloudSphere Systems",
    industry: "Cloud Computing",
    location: "Hyderabad",
    openJobs: 10,
    description:
      "Cloud infrastructure provider offering scalable, secure, and reliable cloud computing solutions to businesses of all sizes.",
    logo: "CS",
    color: "#0891b2",
  },
  {
    id: 4,
    name: "DesignWave Studio",
    industry: "UI/UX Design",
    location: "Mumbai",
    openJobs: 5,
    description:
      "Creative design studio crafting beautiful, user-centered digital experiences for startups and enterprise brands.",
    logo: "DW",
    color: "#db2777",
  },
  {
    id: 5,
    name: "DataBridge Analytics",
    industry: "Data Analytics",
    location: "Remote",
    openJobs: 7,
    description:
      "Data analytics company turning raw data into actionable insights with AI-powered dashboards and reporting tools.",
    logo: "DB",
    color: "#059669",
  },
  {
    id: 6,
    name: "NextHire Technologies",
    industry: "HR Tech",
    location: "Surat",
    openJobs: 6,
    description:
      "HR technology platform streamlining recruitment, onboarding, and employee management with smart automation.",
    logo: "NH",
    color: "#ea580c",
  },
];

const Companies = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Companies - JobNest";
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="companies-page">
      <div className="companies-hero">
        <h1>Explore Top Companies</h1>
        <p>
          Discover leading companies hiring talented professionals. Find the
          right workplace that matches your skills and career goals.
        </p>
        <div className="companies-search">
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
            placeholder="Search by company, industry, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        <div className="companies-grid">
          {filtered.length > 0 ? (
            filtered.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-card-header">
                  <div
                    className="company-logo"
                    style={{ background: company.color }}
                  >
                    {company.logo}
                  </div>
                  <div className="company-info">
                    <h3>{company.name}</h3>
                    <span className="company-industry">{company.industry}</span>
                  </div>
                </div>
                <p className="company-desc">{company.description}</p>
                <div className="company-card-footer">
                  <div className="company-meta">
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
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{company.location}</span>
                  </div>
                  <div className="company-jobs-badge">
                    {company.openJobs} open jobs
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-search">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--gray-400)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <h3>No companies found</h3>
              <p>Try adjusting your search to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
