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
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <h2>Public Registration Disabled</h2>
          <p style={{ color: "#f87171", fontWeight: "bold", marginTop: "15px", fontSize: "1.1rem" }}>
            Self-registration is not allowed.
          </p>
          <p style={{ opacity: 0.8, fontSize: "0.95rem", marginTop: "10px" }}>
            Please contact the Hostel Administrator to create your user login and assign your portal access details.
          </p>
        </div>

        <div className="auth-footer" style={{ marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
          Already have account credentials? 
          <Link to="/login" className="auth-link" style={{ marginLeft: "5px" }}>Login Here</Link>
        </div>
      </div>
    </div>
  );
}
