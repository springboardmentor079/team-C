import React, { useState } from "react";
import '../styles/OfficialsPage.css';

const MOCK_OFFICIALS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Ward Councillor",
    area: "Ward 14",
    email: "sarah.chen@citycouncil.gov",
    phone: "+91 98765 43210",
    image: "S",
    status: "Available"
  },
  {
    id: 2,
    name: "Mr. Rajesh Kumar",
    role: "Zonal Officer",
    area: "North Zone",
    email: "rajesh.kumar@city.gov.in",
    phone: "+91 98765 12345",
    image: "R",
    status: "Busy"
  },
  {
    id: 3,
    name: "Ms. Priya Sharma",
    role: "Health Inspector",
    area: "Ward 14 & 15",
    email: "priya.health@city.gov.in",
    phone: "+91 98765 67890",
    image: "P",
    status: "Available"
  }
];

export default function OfficialsPage({ onLogout, onNavigate }) {
  const [officials] = useState(MOCK_OFFICIALS);
  
  const handleContact = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const go = (page) => onNavigate?.(page);

  return (
    <div className="officials-page">
      {/* Enhanced Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo">C</span>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Officials</p>
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
            className="nav-btn"
            onClick={() => go("polls")}
          >
            <span className="nav-icon">📊</span> Polls
          </button>
          <button 
            className="nav-btn nav-btn-active officials-active"
            onClick={() => go("officials")}
          >
            <span className="nav-icon">🛡️</span> Officials
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="officials-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">Local Officials</h1>
            <p className="page-subtitle">Contact your ward representatives and officials</p>
          </div>
          <div className="header-info">
            <span>📍 Your Area</span>
            <span className="info-divider"></span>
            <span>3 Officials</span>
          </div>
        </header>

        {/* Officials Grid */}
        <div className="officials-grid">
          {officials.map((official) => {
            const isAvailable = official.status === "Available";
            
            return (
              <div 
                key={official.id} 
                className="official-card"
              >
                {/* Header with Avatar & Status */}
                <div className="card-header">
                  <div className={`status-dot ${isAvailable ? "status-available" : "status-busy"}`}></div>
                  
                  <div className="official-info">
                    <div className={`status-badge ${isAvailable ? "status-available" : "status-busy"}`}>
                      {official.status}
                    </div>
                    
                    <div className="avatar-container">
                      <div className="avatar">
                        {official.image}
                      </div>
                    </div>
                    
                    <h3 className="official-name">{official.name}</h3>
                    <p className="official-role">{official.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="card-content">
                  <div className="area-info">
                    <span className="area-icon">📍</span>
                    <span>{official.area}</span>
                  </div>

                  <div className="contact-list">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span className="contact-text">{official.email}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span className="contact-text">{official.phone}</span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <button 
                    onClick={() => handleContact(official.email)}
                    className={`contact-btn ${isAvailable ? "contact-available" : "contact-busy"}`}
                  >
                    <span>✉️</span>
                    Contact Official
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State (if needed) */}
        {officials.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🛡️</div>
            <h3 className="empty-title">No Officials Found</h3>
            <p className="empty-subtitle">Officials for your area will appear here. Try adjusting your location settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
