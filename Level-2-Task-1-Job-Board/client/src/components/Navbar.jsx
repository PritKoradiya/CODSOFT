import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">JobBoard</Link>
      <div className="nav-links">
        <Link to="/jobs">Jobs</Link>
        {user ? (
          <>
            <Link to={user.role === "recruiter" ? "/employer" : "/candidate"}>
              Dashboard
            </Link>
            {user.role === "recruiter" && <Link to="/post-job">Post Job</Link>}
            <button onClick={logout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
