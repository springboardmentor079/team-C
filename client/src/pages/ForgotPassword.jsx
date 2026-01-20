import React, { useState } from "react";

export default function ForgotPassword({ setPage, setEmailProp }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSendOTP = async () => {
    if (!email) return alert("Please enter your email");
    
    setLoading(true); 
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.status === "ok") {
        alert(`OTP sent to ${email}`);
        setEmailProp(email);
        setPage("verify");
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
        <h2>Forgot Password</h2>
        <p className="auth-desc">Enter your email to receive a verification code</p>
        
        <label>Email Address</label>
        <input 
          type="email"
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        
        <button 
          className="primary-btn" 
          onClick={handleSendOTP} 
          disabled={loading}
        >
          {loading ? "Sending Code..." : "Send Verification Code"}
        </button>
        
        <div className="link-btn" onClick={() => setPage("login")}>
          Back to login
        </div>
      </div>
    </>
  );
}