import React, { useState } from "react";
import '../styles/CreatePollPage.css';

export default function CreatePollPage({ onLogout, onNavigate }) {
  const [formData, setFormData] = useState({
    question: "",
    category: "Infrastructure",
    expiresAt: "",
  });
  
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      setMsg("You need at least 2 valid options.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const res = await fetch("/api/polls/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, options: validOptions })
      });

      const data = await res.json();
      if (data.status === "ok") {
        alert("Poll created successfully! 📊");
        onNavigate("polls");
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      setMsg("Error creating poll.");
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
    <div className="create-poll-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">C</div>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Create Poll</p>
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
            className="nav-btn nav-btn-active"
            onClick={() => go("polls")}
          >
            <span className="nav-icon">📊</span> Polls
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">Create Poll</h1>
            <p className="page-subtitle">Gather community opinions instantly</p>
          </div>
          <div>
            <button 
              className="back-btn"
              onClick={() => go("polls")}
            >
              ← View Polls
            </button>
          </div>
        </header>

        {/* Form Container */}
        <div className="form-container">
          {msg && (
            <div className={`alert ${msg.includes("Error") || msg.includes("need") ? "alert-error" : "alert-success"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="poll-form">
            {/* Poll Question */}
            <div className="form-group">
              <label className="form-label">
                Poll Question <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="question" 
                  value={formData.question} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Should we build a new park in Ward 14?"
                  className="form-input title-input"
                />
                <span className="input-icon">❓</span>
              </div>
            </div>

            {/* Options */}
            <div className="form-group">
              <label className="form-label">
                Poll Options <span className="required">*</span> (Min 2, Max 5)
              </label>
              <div className="options-list">
                {options.map((opt, index) => (
                  <div key={index} className="option-row">
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                      className="form-input option-input"
                    />
                    {options.length > 2 && (
                      <button 
                        type="button" 
                        className="remove-option-btn"
                        onClick={() => removeOption(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {options.length < 5 && (
                <button 
                  type="button" 
                  className="add-option-btn"
                  onClick={addOption}
                >
                  ➕ Add Option
                </button>
              )}
            </div>

            {/* Category + Expires */}
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
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Expires At <span className="required">*</span>
                </label>
                <input 
                  type="date" 
                  name="expiresAt" 
                  value={formData.expiresAt} 
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
                onClick={() => go("polls")}
              >
                ← View Polls
              </button>
              <button 
                type="submit" 
                className={`submit-btn ${loading || options.filter(o => o.trim()).length < 2 ? "submit-btn-disabled" : ""}`}
                disabled={loading || options.filter(o => o.trim()).length < 2}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Launching Poll...
                  </>
                ) : (
                  "📊 Launch Poll"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
