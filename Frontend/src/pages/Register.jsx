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
      setError("Network error occurred."+err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center", alignItems: "center" }}>
        <div className="auth-header" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="auth-notice-icon" style={{ margin: "0 auto 10px auto" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: "700", margin: "0 0 5px 0" }}>Registration Closed</h2>
          <p style={{ color: "#ff8b8b", fontWeight: "bold", marginTop: "10px", fontSize: "1.05rem" }}>
            Self-registration is not allowed.
          </p>
          <p style={{ opacity: 0.8, fontSize: "0.95rem", marginTop: "15px", lineHeight: "1.6" }}>
            Please contact the Hostel Administrator or Warden to create your user login and assign your portal access details.
          </p>
        </div>

        <div className="auth-footer" style={{ width: "100%", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px" }}>
          <Link to="/login" className="auth-button" style={{ display: "block", textDecoration: "none", textAlign: "center", margin: "0" }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
