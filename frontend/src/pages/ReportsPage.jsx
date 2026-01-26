import React, { useEffect, useState } from "react";
import '../styles/ReportsPage.css';

export default function ReportsPage({ onLogout, onNavigate }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/reports/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === "ok") {
        setReports(data.data);
      }
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/reports/upvote/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.status === "ok") {
        alert("Upvoted! 👍");
        fetchReports();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error upvoting");
    }
  };

  const go = (page) => onNavigate?.(page);

  return (
    <div className="reports-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container reports-logo">
            <span className="logo">C</span>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Reports</p>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <button onClick={() => go("dashboard")} className="nav-btn">
            <span className="nav-icon">⊞</span> Dashboard
          </button>
          <button onClick={() => go("petitions")} className="nav-btn">
            <span className="nav-icon">📄</span> Petitions
          </button>
          <button onClick={() => go("polls")} className="nav-btn">
            <span className="nav-icon">📊</span> Polls
          </button>
          <button onClick={() => go("officials")} className="nav-btn">
            <span className="nav-icon">🛡️</span> Officials
          </button>
          <button className="nav-btn nav-btn-active">
            <span className="nav-icon">📝</span> Reports
          </button>
          <button onClick={() => go("create-report")} className="create-report-btn">
            <span className="nav-icon">🚨</span> Report Issue
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="reports-main">
        <div className="top-gradient-reports"></div>

        <header className="page-header">
          <div className="header-left">
            <h1 className="page-title">Community Reports</h1>
            <span className="reports-count-badge">
              {reports.length} Issues Reported
            </span>
          </div>
          <div className="header-subtitle">
            Help prioritize community concerns
          </div>
        </header>

        <div className="reports-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚨</div>
              <h3 className="empty-title">No reports yet</h3>
              <p className="empty-subtitle">Report the first issue in your community!</p>
              <button 
                onClick={() => go("create-report")}
                className="report-issue-btn"
              >
                Report Issue
              </button>
            </div>
          ) : (
            <div className="reports-grid">
              {reports.map((report) => (
                <div key={report._id} className="report-card">
                  
                  {/* Header */}
                  <div className="report-header">
                    <div className="report-meta">
                      <span className={`category-tag category-${report.category?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {report.category}
                      </span>
                      <span className={`status-tag status-${report.status?.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <h3 className="report-title">{report.title}</h3>
                    
                    <p className="report-description">{report.description}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="report-meta-info">
                    <div className="meta-row">
                      <span className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{report.location}</span>
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span className="meta-text">{report.author?.fullName || "Anonymous"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Footer with Upvote */}
                  <div className="report-footer">
                    <div className="upvote-section">
                      <div className="upvote-container">
                        <span className="upvote-icon">👍</span>
                        <span className="upvote-count">{report.upvotes.length}</span>
                      </div>
                      <span className="backers-text">Backers</span>
                    </div>
                    
                    <button 
                      onClick={() => handleUpvote(report._id)}
                      className="identify-btn"
                    >
                      <span>✋</span>
                      Identify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
