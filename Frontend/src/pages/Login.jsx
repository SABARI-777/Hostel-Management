import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "./Auth.css";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await loginUser({ Email, Password });

      if (res.error) {
         setError(res.message || "Invalid credentials");
      } else if (res.success && res.token) {
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("token", res.token);
        alert("Login successful! Welcome " + res.data.Type);
        if (res.data.Type === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (res.data.Type === "STUDENT") {
          navigate("/student-dashboard");
        } else if (res.data.Type === "CARETAKER") {
           navigate("/caretaker-dashboard");
        } else if (res.data.Type === "ADVISOR") {
          navigate("/advisor-dashboard");
        } else {
          navigate("/");
        }
      } else if (res.message) {
         setError(res.message);
      } else {
         setError("Login failed");
      }
    } catch (err) {
      setError("Network or server error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-input-group">
          <input
            className="auth-input"
            placeholder="Email Address"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
}
