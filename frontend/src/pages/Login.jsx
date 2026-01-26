import React, { useState } from "react";
import '../styles/Login.css';
const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📥 Login Response:", data);

      if (res.ok && data.status === "success") {
        localStorage.setItem("token", data.token);
        console.log("✅ Login successful, redirecting...");
        onNavigate("dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Server error. Please check if backend is running.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background Elements */}
      <div className="bg-animations">
        <div className="bg-circle-blue"></div>
        <div className="bg-circle-purple"></div>
        <div className="bg-circle-cyan"></div>
      </div>

      <div className="login-container">
        
        {/* Brand Section */}
        <div className="brand-section">
          <div className="logo-container">
            <span className="logo-text">C</span>
          </div>
          <h1 className="brand-title">CivixConnect</h1>
          <p className="brand-subtitle">Your Voice. Your City. Your Power.</p>
          <div className="brand-line"></div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          
          {/* Card Decorative Elements */}
          <div className="card-top-gradient"></div>
          <div className="card-bg-circle"></div>

          <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">Sign in to access your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {/* Email */}
            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing you in...
                </>
              ) : (
                <>
                  🔐 Sign In
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="links-section">
            <button 
              className="link-btn"
              onClick={() => onNavigate("forgot")}
            >
              Forgot Password?
            </button>
            <button 
              className="link-btn register-btn"
              onClick={() => onNavigate("register")}
            >
              Don't have an account? <span className="bold-text">Register now</span>
            </button>
          </div>

          {/* Bottom Branding */}
          <div className="bottom-branding">
            <p className="secure-text">
              Secure login powered by CivixConnect
            </p>
            <div className="branding-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
