import React, { useState } from "react";

export default function Register({ onNavigate, setEmailProp, setTempData }) {
  const [formData, setFormData] = useState({ fullName: "", email: "", location: "", role: "Citizen" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert(`OTP sent to ${formData.email}`);
        setEmailProp(formData.email);
        setTempData(formData);
        onNavigate("verify-reg");
      } else alert(data.message);
    } catch { alert("Server error"); }
    finally { setLoading(false); }
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
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label>User Name</label>
          <input placeholder="Full Name" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
          <label>Email Address</label>
          <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <label>Location</label>
          <input placeholder="Location" onChange={e => setFormData({...formData, location: e.target.value})} required />
          
          <div style={{ margin: "10px 0" }}>
            <label>I am registering as</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
              {["Citizen", "Official"].map(r => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: "#fff" }}>
                  <input type="radio" name="role" checked={formData.role === r} onChange={() => setFormData({...formData, role: r})} style={{width:"auto", margin:0}} /> {r}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Verify Email"}
          </button>
        </form>
        <div className="link-btn" onClick={() => onNavigate("login")}>Already have an account? <b>Login</b></div>
      </div>
    </>
  );
}