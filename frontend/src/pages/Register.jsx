import React, { useState } from "react";
import '../styles/Register.css';

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    location: "Delhi"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Registering:", formData);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      if (res.ok && data.status === "success") {
        localStorage.setItem("token", data.token);
        console.log("✅ Registration successful!");
        onNavigate("dashboard");
      } else {
        setError(data.error || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
      setError("Server error. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Animated Background */}
      <div className="register-bg-animations">
        <div className="reg-bg-circle-indigo"></div>
        <div className="reg-bg-circle-purple"></div>
        <div className="reg-bg-circle-cyan"></div>
      </div>

      <div className="register-container">
        
        {/* Brand Section */}
        <div className="reg-brand-section">
          <div className="reg-logo-container">
            <span className="reg-logo-text">C</span>
          </div>
          <h1 className="reg-brand-title">CivixConnect</h1>
          <p className="reg-brand-subtitle">Your Voice. Your City. Your Power.</p>
          <div className="reg-brand-line"></div>
        </div>

        {/* Registration Card */}
        <div className="register-card">
          
          {/* Decorative Elements */}
          <div className="reg-card-top-gradient"></div>
          <div className="reg-card-bg-circle"></div>

          <div className="reg-card-header">
            <h2 className="reg-card-title">Create Account</h2>
            <p className="reg-card-subtitle">Join us to make your city better</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="reg-error-banner">
              <span className="reg-error-icon">⚠️</span>
              <span className="reg-error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="register-form">
            {/* Full Name */}
            <div className="reg-input-group">
              <span className="reg-input-icon">👤</span>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="reg-form-input"
              />
            </div>

            {/* Email */}
            <div className="reg-input-group">
              <span className="reg-input-icon">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="reg-form-input"
              />
            </div>

            {/* Password */}
            <div className="reg-input-group">
              <span className="reg-input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                className="reg-form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="reg-password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="password-strength">
              {[1, 2, 3, 4].map((i) => {
                let bgClass = "strength-gray";
                if (formData.password.length > i * 2) bgClass = "strength-green";
                else if (formData.password.length > i * 1.5) bgClass = "strength-yellow";
                
                return (
                  <div key={i} className={`strength-bar ${bgClass}`} />
                );
              })}
            </div>

            {/* Location */}
            <div className="reg-input-group">
              <span className="reg-input-icon">📍</span>
              <input
                type="text"
                name="location"
                placeholder="Your city (e.g. Delhi)"
                value={formData.location}
                onChange={handleChange}
                className="reg-form-input"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="reg-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  🚀 Register
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="reg-links-section">
            <button 
              className="reg-link-btn"
              onClick={() => onNavigate("login")}
            >
              Already have an account? <span className="reg-bold-text">Sign In</span>
            </button>
          </div>

          {/* Bottom Branding */}
          <div className="reg-bottom-branding">
            <p className="reg-secure-text">
              Secure registration powered by CivixConnect
            </p>
            <div className="reg-branding-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
