import React, { useState } from "react";
import '../styles/CreatePetitionPage.css';

export default function CreatePetitionPage({ onLogout, onNavigate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    targetSignatures: 100,
    deadline: "",
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

      const res = await fetch("/api/petitions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.status === "ok") {
        alert("Petition created successfully! 🎉");
        onNavigate("petitions");
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      setMsg("Error creating petition.");
    } finally {
      setLoading(false);
    }
  };

  const go = (page) => onNavigate?.(page);

  const categories = [
    "Infrastructure", "Environment", "Transport", 
    "Safety", "Education", "Other"
  ];

  return (
    <div className="create-petition-page">
      {/* Enhanced Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">C</div>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Create Petition</p>
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
            className="nav-btn nav-btn-active"
            onClick={() => go("petitions")}
          >
            <span className="nav-icon">📄</span> Petitions
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">Start a Petition</h1>
            <p className="page-subtitle">Make your voice heard in your community</p>
          </div>
          <div>
            <button 
              className="back-btn"
              onClick={() => go("petitions")}
            >
              ← View Petitions
            </button>
          </div>
        </header>

        {/* Form Container */}
        <div className="form-container">
          {msg && (
            <div className={`alert ${msg.includes("Error") ? "alert-error" : "alert-success"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="petition-form">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Petition Title <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Fix the potholes on Main Street"
                  className="form-input title-input"
                />
                <span className="input-icon">📝</span>
              </div>
            </div>

            {/* Category + Location Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="form-input"
                  required
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
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Ward 14, Sathyamangalam"
                  className="form-input"
                />
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
                placeholder="Explain the issue clearly and your proposed solution..."
                className="form-textarea"
              />
            </div>

            {/* Target Signatures + Deadline Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Target Signatures <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    name="targetSignatures" 
                    value={formData.targetSignatures} 
                    onChange={handleChange} 
                    min="10"
                    required 
                    className="form-input"
                  />
                  <span className="input-icon">👥</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Deadline <span className="required">*</span>
                </label>
                <input 
                  type="date" 
                  name="deadline" 
                  value={formData.deadline} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => go("petitions")}
              >
                ← Cancel & View Petitions
              </button>
              <button 
                type="submit" 
                className={`submit-btn ${loading || formData.title.length < 10 ? "submit-btn-disabled" : ""}`}
                disabled={loading || formData.title.length < 10}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  "🚀 Launch Petition"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
