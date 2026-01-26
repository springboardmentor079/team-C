import { useState } from "react";
import '../styles/VerificationCode.css';
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

  const isPasswordValid = newPassword.length >= 6;

  return (
    <div className="reset-password-page">
      {/* Enhanced Animated Background */}
      <div className="reset-bg-container">
        <div className="reset-bg-circle-1"></div>
        <div className="reset-bg-circle-2"></div>
        <div className="reset-bg-circle-3"></div>
        <div className="reset-bg-circle-4"></div>
      </div>

      <div className="reset-modal">
        
        {/* Enhanced Decorative Elements */}
        <div className="reset-top-line"></div>
        <div className="reset-deco-circle-1"></div>
        <div className="reset-deco-circle-2"></div>

        {/* Header */}
        <div className="reset-header">
          <div className="reset-icon-wrapper">
            🔑
          </div>

          <h2 className="reset-main-title">New Password</h2>
          
          <div className="email-verified-section">
            <span className="verified-icon">🛡️</span>
            <p className="verified-email">{email}</p>
            <div className="verified-dot"></div>
          </div>
        </div>
        
        <div className="reset-form">
          {/* Password Input */}
          <div className="password-input-group">
            <span className="password-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (minimum 6 characters)"
              className="password-field"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-visibility-toggle"
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Enhanced Password Strength */}
          <div className="strength-section">
            <div className="strength-label">
              <span>Password Strength</span>
              <span>{isPasswordValid ? "Strong" : "Weak"}</span>
            </div>
            <div className="strength-bars">
              {Array.from({ length: 4 }, (_, i) => {
                let strengthClass = "strength-weak";
                if (newPassword.length > i * 2) strengthClass = "strength-strong";
                else if (newPassword.length > i * 1.5) strengthClass = "strength-medium";
                
                return (
                  <div key={i} className={`strength-bar ${strengthClass}`} />
                );
              })}
            </div>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={handleReset}
            disabled={loading || !isPasswordValid}
            className={`reset-submit-btn ${loading || !isPasswordValid ? "reset-disabled" : ""}`}
          >
            {loading ? (
              <>
                <span className="reset-spinner"></span>
                <span>Securing Account...</span>
              </>
            ) : (
              <>
                ✅ Reset Password
              </>
            )}
          </button>
          
          {/* Back Button */}
          <div className="back-button-section">
            <button 
              onClick={onLogin} 
              className="back-login-btn"
            >
              ← Return to Login
            </button>
          </div>
        </div>

        {/* Enhanced Security Footer */}
        <div className="security-footer">
          <div className="security-badge">
            🛡️ End-to-End Encrypted
          </div>
          <div className="security-line"></div>
        </div>
      </div>
    </div>
  );
}
