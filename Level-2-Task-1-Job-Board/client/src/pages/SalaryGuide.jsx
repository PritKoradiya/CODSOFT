import { useState, useEffect } from "react";

const salaries = [
  {
    id: 1,
    role: "Web Designer",
    min: 20000,
    max: 50000,
    icon: "🎨",
    description: "Creating visually appealing and user-friendly website layouts.",
  },
  {
    id: 2,
    role: "Frontend Developer",
    min: 25000,
    max: 70000,
    icon: "💻",
    description: "Building interactive and responsive user interfaces using React, Vue, or Angular.",
  },
  {
    id: 3,
    role: "MERN Stack Developer",
    min: 30000,
    max: 90000,
    icon: "⚛️",
    description: "Full-stack development with MongoDB, Express, React, and Node.js.",
  },
  {
    id: 4,
    role: "Backend Developer",
    min: 35000,
    max: 100000,
    icon: "🔧",
    description: "Designing and building server-side logic, APIs, and database integrations.",
  },
  {
    id: 5,
    role: "UI/UX Designer",
    min: 25000,
    max: 65000,
    icon: "✏️",
    description: "Crafting intuitive user experiences and stunning visual designs for digital products.",
  },
  {
    id: 6,
    role: "Software Engineer Intern",
    min: 10000,
    max: 25000,
    icon: "🎓",
    description: "Learning and contributing to real-world projects under professional mentorship.",
  },
];

const SalaryGuide = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Salary Guide - JobNest";
  }, []);

  const filtered = salaries.filter((s) =>
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const formatSalary = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
    }
    return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 0)}K`;
  };

  return (
    <div className="salary-page">
      <div className="salary-hero">
        <h1>Salary Guide</h1>
        <p>
          Explore average salary ranges for popular tech roles in India. Make
          informed decisions about your career and compensation expectations.
        </p>
        <div className="salary-search">
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
            placeholder="Search by job role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        <div className="salary-grid">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div key={item.id} className="salary-card">
                <div className="salary-card-icon">{item.icon}</div>
                <div className="salary-card-body">
                  <h3>{item.role}</h3>
                  <p className="salary-card-desc">{item.description}</p>
                  <div className="salary-range">
                    <div className="salary-range-bar">
                      <div
                        className="salary-range-fill"
                        style={{
                          left: `${(item.min / 100000) * 100}%`,
                          width: `${((item.max - item.min) / 100000) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="salary-range-labels">
                      <span className="salary-min">
                        {formatSalary(item.min)}/mo
                      </span>
                      <span className="salary-max">
                        {formatSalary(item.max)}/mo
                      </span>
                    </div>
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
              <h3>No roles found</h3>
              <p>Try adjusting your search to find what you're looking for.</p>
            </div>
          )}
        </div>

        <div className="salary-note">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--warning)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            <strong>Note:</strong> Salary ranges shown are sample estimates for
            project demonstration purposes only. Actual salaries may vary based
            on experience, location, company size, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryGuide;
