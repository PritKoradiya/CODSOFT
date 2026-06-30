import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#2563eb" />
          <path d="M8 10C8 8.89543 8.89543 8 10 8H12C13.1046 8 14 8.89543 14 10V12C14 13.1046 13.1046 14 12 14H10C8.89543 14 8 13.1046 8 12V10Z" fill="white" />
          <path d="M14 16C14 14.8954 14.8954 14 16 14H18C19.1046 14 20 14.8954 20 16V20C20 21.1046 19.1046 22 18 22H16C14.8954 22 14 21.1046 14 20V16Z" fill="white" opacity="0.6" />
          <path d="M8 16C8 14.8954 8.89543 14 10 14H12C13.1046 14 14 14.8954 14 16V20C14 21.1046 13.1046 22 12 22H10C8.89543 22 8 21.1046 8 20V16Z" fill="white" opacity="0.3" />
        </svg>
        JobNest
      </Link>

      <div className="nav-center">
        <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
        <Link to="/jobs" className={isActive("/jobs") ? "active" : ""}>Jobs</Link>
        <Link to="/companies" className={isActive("/companies") ? "active" : ""}>Companies</Link>
        <Link to="/salary-guide" className={isActive("/salary-guide") ? "active" : ""}>Salary Guide</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <button className="nav-icon-btn" title="Saved Jobs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="nav-icon-btn" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot"></span>
            </button>
            <div className="nav-divider"></div>
            <Link to={user.role === "recruiter" ? "/employer" : "/candidate"} className="nav-user-btn">
              <div className="nav-user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
              <span>{user.name}</span>
            </Link>
            {user.role === "recruiter" && (
              <Link to="/post-job" className="nav-post-btn">+ Post Job</Link>
            )}
            <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
          </>
        ) : (
          <div className="nav-auth-links">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}

        <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      <div className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
        <Link to="/jobs" onClick={() => setMobileOpen(false)}>Jobs</Link>
        <Link to="/companies" onClick={() => setMobileOpen(false)}>Companies</Link>
        <Link to="/salary-guide" onClick={() => setMobileOpen(false)}>Salary Guide</Link>
        <div className="mobile-divider"></div>
        {user ? (
          <>
            <Link to={user.role === "recruiter" ? "/employer" : "/candidate"} onClick={() => setMobileOpen(false)}>Dashboard</Link>
            {user.role === "recruiter" && <Link to="/post-job" onClick={() => setMobileOpen(false)}>Post Job</Link>}
            <button onClick={() => { logout(); setMobileOpen(false); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
