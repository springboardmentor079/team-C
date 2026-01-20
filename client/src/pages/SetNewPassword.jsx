import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SetNewPassword({ setPage, emailProp, tempData, isRegistration }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!newPassword || !confirmPassword) return alert("Please fill both fields");
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return alert("Password is weak! (Min 8 chars, 1 Uppercase, 1 Number, 1 Special Char are required)");
    }

    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    const endpoint = isRegistration ? "register" : "reset-password";
    const payload = isRegistration 
      ? { ...tempData, password: newPassword } 
      : { email: emailProp, newPassword };

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert(isRegistration ? "Account Created Successfully!" : "Password Updated!");
        setPage("login");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="brand">
        <div className="brand-header">
          <div className="logo-circle">C</div>
          <h1>CivixConnect</h1>
        </div>
        <p>Your Voice. Your City. Your Power.</p>
      </div>

      <div className="auth-card">
        <h2>{isRegistration ? "Set Your Password" : "Reset Password"}</h2>
        <p className="auth-desc">Strong password protects your account</p>
        
        <label>New Password</label>
        <div style={{ position: "relative" }}>
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="New password"
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            style={{ paddingRight: "45px" }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "12px",
              top: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        <label>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="Confirm password"
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            style={{ paddingRight: "45px" }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "12px",
              top: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        <button className="primary-btn" onClick={handleAction} disabled={loading}>
          {loading ? "Processing..." : (isRegistration ? "Complete Registration" : "Update Password")}
        </button>
      </div>
    </>
  );
}