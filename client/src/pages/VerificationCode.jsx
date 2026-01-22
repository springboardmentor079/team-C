import React, { useState, useEffect } from "react";

export default function VerificationCode({ setPage, emailProp, backPage }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`).focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return alert("Enter 6 digits");
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailProp, otp: code }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setPage("reset"); 
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
        <h2>Enter Verification Code</h2>
        <p className="auth-desc">OTP sent to <strong>{emailProp}</strong></p>
        
        <div className="otp-row">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              className="otp-box"
              maxLength="1"
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
        </div>
        <div className="timer">OTP expires in {minutes}:{seconds < 10 ? "0" : ""}{seconds}</div>
        
        <button className="primary-btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify Code"}
        </button>
        
        <div className="link-btn" onClick={() => setPage(backPage)}>
          Back to {backPage === "register" ? "Register" : "Forgot Password"}
        </div>
      </div>
    </>
  );
}