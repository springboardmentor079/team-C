import { useState } from "react";
import VerificationCode from "./VerificationCode";
import '../styles/ForgotPassword.css';

export default function ForgotPassword({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("email");
  const [emailProp, setEmailProp] = useState("");

  const handleSendOTP = async () => {
    if (!email.trim()) return alert("Please enter your email");
    
    const cleanEmail = email.trim();
    console.log("🔍 Sending OTP to:", cleanEmail);
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      
      if (data.status === "success") {
        alert(`OTP sent to ${cleanEmail}`);
        setEmailProp(cleanEmail);
        setPage("verify");
      } else {
        alert(data.message || "Email not found");
      }
    } catch (error) {
      alert("Server error. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render VerificationCode if page is 'verify'
  if (page === "verify") {
    return (
      <VerificationCode 
        email={emailProp} 
        onBack={() => setPage("email")} 
        onLogin={onLogin} 
      />
    );
  }

  return (
    <div className="forgot-password-modal">
      <div className="modal-content">
        {/* Decorative Background */}
        <div className="top-gradient"></div>
        <div className="bg-circle-1"></div>
        <div className="bg-circle-2"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="close-btn"
        >
          ✕
        </button>

        {/* Content */}
        <div className="modal-inner">
          {/* Icon */}
          <div className="icon-container">
            ✉️
          </div>

          {/* Title */}
          <h2 className="modal-title">Forgot Password?</h2>
          <p className="modal-subtitle">
            Enter your email address and we'll send you a secure OTP to reset your password.
          </p>

          {/* Form */}
          <div className="form-container">
            <div className="email-input-wrapper">
              <span className="email-icon">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                placeholder="Enter your email address"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !email.trim()}
              className={`send-btn ${loading || !email.trim() ? "send-btn-disabled" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  📧 Send Recovery Code
                </>
              )}
            </button>

            <div className="back-btn-container">
              <button
                onClick={onClose}
                className="back-to-login-btn"
              >
                ← Back to Login
              </button>
            </div>
          </div>

          {/* Bottom Decorative Text */}
          <p className="secure-text">
            Secure recovery powered by CivixConnect
          </p>
        </div>
      </div>
    </div>
  );
}
