import React, { useEffect, useState } from "react";
import '../styles/PollsPage.css';

export default function PollsPage({ onLogout, onNavigate }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/polls/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === "ok") {
        setPolls(data.data);
      }
    } catch (error) {
      console.error("Error fetching polls", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/polls/vote", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ pollId, optionIndex })
      });
      
      const data = await res.json();
      if (data.status === "ok") {
        alert("Vote Cast! 🗳️");
        fetchPolls();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error voting");
    }
  };

  const go = (page) => onNavigate?.(page);

  return (
    <div className="polls-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container polls-logo">
            <span className="logo">C</span>
          </div>
          <div>
            <h1 className="sidebar-title">CivixConnect</h1>
            <p className="sidebar-subtitle">Polls</p>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <button onClick={() => go("dashboard")} className="nav-btn">
            <span className="nav-icon">⊞</span> Dashboard
          </button>
          <button onClick={() => go("petitions")} className="nav-btn">
            <span className="nav-icon">📄</span> Petitions
          </button>
          <button className="nav-btn nav-btn-active">
            <span className="nav-icon">📊</span> Polls
          </button>
          <button onClick={() => go("create-poll")} className="create-poll-btn">
            <span className="nav-icon">◴</span> Create Poll
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="polls-main">
        <div className="top-gradient-polls"></div>

        <header className="page-header">
          <div className="header-left">
            <h1 className="page-title">Community Polls</h1>
            <span className="to-vote-badge">
              {polls.filter(p => !p.hasVoted).length} to vote
            </span>
          </div>
          <div className="polls-count">
            {polls.length} Active Polls
          </div>
        </header>

        <div className="polls-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : polls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3 className="empty-title">No polls active</h3>
              <p className="empty-subtitle">Be the first to create a community poll!</p>
              <button 
                onClick={() => go("create-poll")}
                className="create-poll-empty-btn"
              >
                Create Poll
              </button>
            </div>
          ) : (
            <div className="polls-grid">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                
                return (
                  <div key={poll._id} className="poll-card">
                    {/* Header */}
                    <div className="poll-header">
                      <div className="poll-meta">
                        <span className="category-tag">{poll.category}</span>
                        <span className="expires-badge">
                          Ends {new Date(poll.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="poll-question">{poll.question}</h3>
                    </div>

                    {/* Options */}
                    <div className="poll-options">
                      {poll.options.map((opt, idx) => {
                        const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                        const isVoted = poll.hasVoted;
                        
                        return (
                          <div 
                            key={idx} 
                            className={`poll-option ${isVoted ? "voted" : "voteable"}`}
                            onClick={() => !poll.hasVoted && handleVote(poll._id, idx)}
                          >
                            <div className="option-header">
                              <span className="option-text">{opt.text}</span>
                              {isVoted && (
                                <span className="vote-percent">{percentage}%</span>
                              )}
                            </div>
                            {isVoted && (
                              <div className="option-progress">
                                <div 
                                  className="option-progress-fill"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="poll-footer">
                      <div className="footer-info">
                        <span className="total-votes">{totalVotes} votes total</span>
                        {poll.hasVoted ? (
                          <span className="voted-badge">✅ Voted</span>
                        ) : (
                          <span className="vote-hint">Click to vote</span>
                        )}
                      </div>
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
