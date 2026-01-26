import React, { useEffect, useState } from "react";
import '../styles/PetitionsPage.css';

export default function PetitionsPage({ onLogout, onNavigate }) {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/petitions/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.status === "ok") {
        setPetitions(data.data);
      } else {
        setErr(data.message);
      }
    } catch (error) {
      setErr("Failed to load petitions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/petitions/sign/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.status === "ok") {
        alert("Signed successfully! 🎉");
        fetchPetitions(); 
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert("Error signing petition");
    }
  };

  const go = (page) => onNavigate?.(page);

  return (
    <div className="petitions-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">⚡</div>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <span className="petitions-badge">Petitions</span>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <button onClick={() => go("dashboard")} className="nav-btn">
            <span className="nav-icon">⊞</span> Dashboard
          </button>
          <button className="nav-btn nav-btn-active">
            <span className="nav-icon">📄</span> Petitions
          </button>
          <button onClick={() => go("create-petition")} className="create-petition-btn">
            <span className="nav-icon">➕</span> Start Petition
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="petitions-main">
        <div className="top-gradient"></div>

        <header className="page-header">
          <h1 className="page-title">Community Petitions</h1>
          <div className="petitions-count">
            {petitions.length} Active Campaigns
          </div>
        </header>

        <div className="petitions-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : err ? (
            <div className="error-container">
              {err}
            </div>
          ) : petitions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h3 className="empty-title">No petitions yet</h3>
              <p className="empty-subtitle">Be the first to start a change in your community!</p>
              <button 
                onClick={() => go("create-petition")}
                className="start-petition-btn"
              >
                Start a Petition
              </button>
            </div>
          ) : (
            <div className="petitions-grid">
              {petitions.map((p) => {
                const progress = Math.min((p.signatureCount / p.targetSignatures) * 100, 100);
                const isActive = p.status === "Active";

                return (
                  <div key={p._id} className="petition-card">
                    <div className="card-body">
                      <div className="card-meta">
                        <span className="category-tag">{p.category}</span>
                        <span className={`status-tag ${isActive ? "status-active" : "status-closed"}`}>
                          {p.status}
                        </span>
                      </div>

                      <h3 className="petition-title">{p.title}</h3>
                      
                      <p className="petition-description">{p.description}</p>

                      <div className="progress-section">
                        <div className="progress-info">
                          <span className="signature-count">{p.signatureCount} signed</span>
                          <span className="target-count">Goal: {p.targetSignatures}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="location-info">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{p.location}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleSign(p._id)}
                        disabled={!isActive}
                        className={`sign-btn ${isActive ? "sign-active" : "sign-disabled"}`}
                      >
                        {isActive ? "✍️ Sign Now" : "Closed"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
