import React, { useEffect, useState, useCallback } from "react";
import '../styles/Dashboard.css';

export default function DashboardPage({ onLogout, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    user: { name: "", location: "", role: "", avatar: "" },
    stats: { myPetitions: 0, pollsVoted: 0, impactPoints: 0, activeReports: 0 },
    trending: { title: "", signatures: 0, targetSignatures: 0, timeLeft: "", urgent: false, percentage: 0 }
  });
  const [search, setSearch] = useState("");

  // ✅ 1. Define safeLogout FIRST so it can be used below
  const safeLogout = useCallback(() => {
    localStorage.removeItem("token");
    onLogout?.() || onNavigate?.("login");
  }, [onLogout, onNavigate]);

  // ✅ 2. Now define fetchDashboardData, depending on safeLogout
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        safeLogout();
        return;
      }

      setLoading(true);
      setErr("");

      const response = await fetch("http://localhost:5000/api/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          safeLogout();
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch dashboard`);
      }

      const apiData = await response.json();
      console.log("Dashboard data:", apiData);
      setData(apiData);

    } catch (error) {
      console.error("Dashboard API error:", error);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }, [safeLogout]); // ✅ safeLogout is now a valid dependency

  // ✅ 3. Use Effect
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ✅ 4. Navigation helper
  const go = useCallback((page) => {
    onNavigate?.(page);
  }, [onNavigate]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Dashboard...</div>
      </div>
    </div>
  );

  if (err) return (
    <div className="error-screen">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-msg">{err}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">⚡</div>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <span className="beta-badge">BETA</span>
          </div>
        </div>
        
        <div className="sidebar-scroll">
          <div className="sidebar-section">
            <div className="section-title">Main Menu</div>
            <div className="nav-list">
              <button className="nav-btn nav-btn-active">
                <span className="nav-icon">⊞</span> Dashboard
              </button>
              <button onClick={() => go("petitions")} className="nav-btn">
                <span className="nav-icon">📄</span> Petitions
              </button>
              <button onClick={() => go("polls")} className="nav-btn">
                <span className="nav-icon">📊</span> Polls
              </button>
            </div>
          </div>
          
          <div className="sidebar-section">
            <div className="section-title">Governance</div>
            <div className="nav-list">
              <button onClick={() => go("officials")} className="nav-btn">
                <span className="nav-icon">🛡️</span> Officials
              </button>
              <button onClick={() => go("reports")} className="nav-btn">
                <span className="nav-icon">📝</span> Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={safeLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">
        {/* Top Gradient Bar */}
        <div className="top-gradient-bar"></div>

        <header className="dash-header">
          <div className="search-container">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search issues, officials..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="header-actions">
            <button className="notif-btn">
              <span className="bell-icon">🔔</span>
              <span className="notif-dot"></span>
            </button>
            
            <div className="user-profile">
              <div className="user-text">
                <div className="user-name">{data.user.name || "Citizen"}</div>
                <div className="user-badge">VERIFIED</div>
              </div>
              <div className="user-avatar">
                {data.user.avatar || data.user.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        <div className="dash-content">
          <div className="content-width">
            
            {/* Welcome Section */}
            <div className="welcome-section">
              <div>
                <h1 className="welcome-title">Executive Overview</h1>
                <p className="welcome-subtitle">
                  Welcome back, <span className="highlight-text">{data.user.name || "Citizen"}</span>. Here's what's happening today.
                </p>
              </div>
              <div className="location-badge">
                <span>📍</span>
                <span>{data.user.location || "Loading Location..."}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {[
                { label: "My Petitions", value: data.stats.myPetitions, icon: "📄", color: "blue" },
                { label: "Polls Voted", value: data.stats.pollsVoted, icon: "📊", color: "green" },
                { label: "Impact Points", value: data.stats.impactPoints, icon: "🎗", color: "amber" },
                { label: "Active Reports", value: data.stats.activeReports, icon: "🚨", color: "red" },
              ].map((stat, i) => (
                <div key={i} className={`stat-card stat-${stat.color}`}>
                  <div className="stat-header">
                    <div className="stat-icon-wrapper">
                      {stat.icon}
                    </div>
                    {i === 2 && <span className="growth-badge">+12%</span>}
                  </div>
                  <div className="stat-value">{stat.value || 0}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-split">
              {/* Trending Issue */}
              <div className="trending-card">
                <div className="trending-bg"></div>
                
                <div className="trending-header">
                  <div className="trending-label">
                    <div className="fire-icon">🔥</div>
                    <h3 className="trending-title-text">Trending Issue</h3>
                  </div>
                  <button className="view-all-btn">View All →</button>
                </div>

                <div className="trending-content">
                  <div className="trending-meta">
                    {data.trending.urgent && (
                      <span className="urgent-tag">URGENT</span>
                    )}
                    <span className="time-left">
                      ⏱ {data.trending.timeLeft || "Loading..."} left
                    </span>
                  </div>
                  
                  <h2 className="trending-main-title">
                    {data.trending.title || "No trending issues currently available in your area."}
                  </h2>
                  
                  <div className="progress-container">
                    <div className="progress-info">
                      <span className="sig-count">{data.trending.signatures || 0} signatures</span>
                      <span className="goal-percent">{data.trending.percentage || 0}% goal reached</span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill"
                        style={{width: `${data.trending.percentage || 0}%`}}
                      />
                    </div>
                    <p className="progress-target">Target: {data.trending.targetSignatures || 1000} signatures</p>
                  </div>
                </div>
              </div>
              
              {/* Civic Score */}
              <div className="civic-score-card">
                <div className="rank-bg">#1</div>
                
                <h3 className="civic-title">
                  <span>🏆</span> Civic Score
                </h3>
                
                <div className="score-display">
                  <div className="score-number">
                    {data.stats.impactPoints || 0}
                  </div>
                  <div className="rank-badge">
                    SILVER CITIZEN
                  </div>
                </div>
                
                <div className="score-progress">
                  <div className="score-track">
                    <div className="score-fill"></div>
                  </div>
                  <div className="score-labels">
                    <span>Current</span>
                    <span>Next: Gold (1200)</span>
                  </div>
                </div>
                
                <div className="achievement-grid">
                  {['🏆', '⭐', '📈'].map((icon, i) => (
                    <div key={i} className={`achieve-icon ${i===0 ? 'achieve-active' : ''}`}>
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
