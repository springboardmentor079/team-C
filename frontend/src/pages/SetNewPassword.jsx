import { useState } from "react";
import '../styles/SetNewPassword.css';
export default function SetNewPassword({ email, otp, onLogin }) {
  const [newPassword, setNewPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    console.log("🔍 Reset sending:", { email, otp, newPassword }); 

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword: newPassword
        }),
      });
      const data = await res.json();
      console.log("📥 Reset response:", data); 

      if (data.status === "success") {
        alert("✅ Password updated! You can now login.");
        onLogin(); 
      } else {
        alert(data.message || "Reset failed");
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-modal">
      {/* Animated Background Elements */}
      <div className="reset-bg-animations">
        <div className="reset-bg-circle-emerald"></div>
        <div className="reset-bg-circle-teal"></div>
      </div>

      <div className="reset-modal-content">
        
        {/* Decorative Top Line */}
        <div className="reset-top-gradient"></div>

        <div className="reset-header">
          {/* Icon */}
          <div className="reset-icon-container">
            🔑
          </div>

          <h2 className="reset-title">Set New Password</h2>
          
          <div className="email-display">
            <div className="email-dot"></div>
            <p className="email-text">{email}</p>
          </div>
        </div>
        
        <div className="reset-form-container">
          <div className="reset-input-group">
            <span className="reset-input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (6+ chars)"
              className="reset-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="reset-password-toggle"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password Strength Bar */}
          <div className="strength-bar-container">
            <div 
              className={`strength-bar-fill ${newPassword.length >= 6 ? "strength-full" : "strength-weak"}`}
            />
          </div>
          
          <button
            onClick={handleReset}
            disabled={loading || newPassword.length < 6}
            className={`reset-btn ${loading || newPassword.length < 6 ? "reset-disabled" : ""}`}
          >
            {loading ? (
              <>
                <span className="reset-spinner"></span>
                Updating...
              </>
            ) : (
              <>
                ✅ Reset Password
              </>
            )}
          </button>
          
          <div className="reset-back-section">
            <button 
              onClick={onLogin} 
              className="back-to-login-btn"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="reset-footer">
          Secure Encryption • End-to-End Protected
        </p>
      </div>
    </div>
  );
}
