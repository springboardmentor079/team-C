import React, { useState } from "react";
import '../styles/CreateReportPage.css';

export default function CreateReportPage({ onLogout, onNavigate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const res = await fetch("/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.status === "ok") {
        alert("Report submitted! 🚨");
        onNavigate("reports");
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      setMsg("Error submitting report.");
    } finally {
      setLoading(false);
    }
  };

  const go = (page) => onNavigate?.(page);

  const categories = ["Infrastructure", "Sanitation", "Health", "Environment", "Other"];

  return (
    <div className="create-report-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container report-logo-bg">
            <div className="logo">C</div>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Report Issue</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className="nav-btn"
            onClick={() => go("dashboard")}
          >
            <span className="nav-icon">⊞</span> Dashboard
          </button>
          <button 
            className="nav-btn"
            onClick={() => go("petitions")}
          >
            <span className="nav-icon">📄</span> Petitions
          </button>
          <button 
            className="nav-btn nav-btn-active report-active"
            onClick={() => go("reports")}
          >
            <span className="nav-icon">📝</span> Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title report-title">Report an Issue</h1>
            <p className="page-subtitle">Alert authorities about local problems</p>
          </div>
          <div>
            <button 
              className="back-btn"
              onClick={() => go("reports")}
            >
              ← View Reports
            </button>
          </div>
        </header>

        {/* Form Container */}
        <div className="form-container report-container">
          {/* Decorative Warning Stripe */}
          <div className="warning-stripe"></div>

          {msg && (
            <div className={`alert ${msg.includes("Error") ? "alert-error" : "alert-success"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Issue Title <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Street light not working"
                  className="form-input title-input report-focus"
                />
                <span className="input-icon">🚨</span>
              </div>
            </div>

            {/* Category + Location */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="form-input report-focus"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Location <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., Near Main Market, Ward 14"
                    className="form-input report-focus"
                  />
                  <span className="input-icon">📍</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                rows="6"
                placeholder="Describe the issue in detail..."
                className="form-textarea report-focus"
              />
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => go("reports")}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`submit-btn report-submit ${loading || formData.title.length < 5 ? "submit-btn-disabled" : ""}`}
                disabled={loading || formData.title.length < 5}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>⚠️ Submit Report</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
