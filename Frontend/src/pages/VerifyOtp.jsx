import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { verifyOTP } from "../api/auth";
import "./Auth.css";

export default function VerifyOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const emailToVerify = state?.Email || "";
      if (!emailToVerify) {
        setError("Email not found. Please try registering again.");
        setIsLoading(false);
        return;
      }

      const res = await verifyOTP({ Email: emailToVerify, otp });

      if (res.message === "OTP Verified Successfully" || res.data) {
        alert("Verification successful!");
        navigate("/login");
      } else {
        setError(res.message || "OTP verification failed");
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
          <h2>Verify Account</h2>
          <p>We sent a one-time password to your email</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-input-group">
          <input 
            className="auth-input"
            type="text"
            placeholder="Enter 6-digit OTP" 
             required
            onChange={(e) => setOtp(e.target.value)} 
          />
          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="auth-footer">
          Didn't receive an email?
          <Link to="/register" className="auth-link">Register Again</Link>
        </div>
      </div>
    </div>
  );
}
