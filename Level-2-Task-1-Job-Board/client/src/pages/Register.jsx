import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  useEffect(() => {
    document.title = "Register - JobNest";
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate(formData.role === "recruiter" ? "/employer" : "/candidate");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Join JobNest and start your journey</p>
        {error && <div className="error-msg">{error}</div>}

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Min 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <label>I am a</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="candidate">Candidate - Looking for jobs</option>
          <option value="recruiter">Employer - Posting jobs</option>
        </select>

        <button type="submit" className="btn btn-primary btn-block btn-lg">Create Account</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
