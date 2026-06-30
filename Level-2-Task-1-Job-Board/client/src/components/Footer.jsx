import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand-section">
          <div className="footer-brand">JobNest</div>
          <p className="footer-desc">
            A modern job portal connecting talented candidates with top
            employers. Built as part of the CodSoft Web Development
            Internship program.
          </p>
          <p className="footer-credit">
            Made by <strong>Pritkumar Koradiya</strong>
          </p>
        </div>

        <div className="footer-col">
          <h4>For Candidates</h4>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/candidate">My Applications</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="footer-col">
          <h4>For Employers</h4>
          <Link to="/post-job">Post a Job</Link>
          <Link to="/employer">Employer Dashboard</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="footer-col">
          <h4>Project Info</h4>
          <span className="footer-info-text">CodSoft Internship</span>
          <span className="footer-info-text">Web Development</span>
          <span className="footer-info-text">Level 2 - Task 1</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {year} JobNest. Built by Pritkumar Koradiya | CodSoft Web
          Development Internship - Level 2 Task 1
        </p>
      </div>
    </footer>
  );
};

export default Footer;
