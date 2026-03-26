import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    Email: "",
    Password: "",
    MobileNumber: "",
    Type: "STUDENT",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await registerUser(form);

      if (res.data && res.data.Email) {
        navigate("/verify-otp", { state: { Email: res.data.Email } });
      } else if (res.message) {
        setError(res.message); // This will display the exact error from the backend natively in red text
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the Hostel Management System</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-input-group">
          <input 
            className="auth-input"
            name="Email" 
            type="email"
            placeholder="Email Address" 
            required
            onChange={change} 
          />
          <input 
            className="auth-input"
            name="Password" 
            placeholder="Password" 
            type="password" 
            required
            onChange={change} 
            minLength={4}
          />
          <input 
            className="auth-input"
            name="MobileNumber" 
            placeholder="Mobile Number" 
            required
            onChange={change} 
          />
          
          <select 
            className="auth-input auth-select" 
            name="Type" 
            onChange={change}
            defaultValue="STUDENT"
          >
            <option value="STUDENT">Student</option>
            <option value="CARETAKER">Caretaker</option>
            <option value="ADVISOR">Advisor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
}
