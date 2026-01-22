import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

export default function DashboardPage({ onLogout, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    user: { name: "Loading...", location: "", role: "Citizen" },
    stats: { myPetitions: 0, successfulPetitions: 0, pollsCreated: 0 },
    petitionsNearYou: [],
    categories: [],
  });

  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [search, setSearch] = useState("");

  // Safe logout
  const safeLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    onLogout?.() || onNavigate?.("login");
  };

  // ✅ FIXED useEffect with ESLint disable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      safeLogout();
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          safeLogout();
          return;
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "API error");

        setData({
          user: {
            name: json?.user?.name || json?.user?.fullName || "User",
            location: json?.user?.location || "Unknown",
            role: json?.user?.role || "Citizen",
          },
          stats: json?.stats || data.stats,
          petitionsNearYou: Array.isArray(json?.petitionsNearYou) ? json.petitionsNearYou : [],
          categories: Array.isArray(json?.categories) ? json.categories : [],
        });
      } catch (e) {
        setErr(e.message || "Failed to load dashboard");
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = useMemo(
    () => ["All Categories", ...data.categories],
    [data.categories]
  );

  const filteredPetitions = useMemo(() => {
    const list = data.petitionsNearYou || [];
    const q = search.trim().toLowerCase();

    return list.filter((p) => {
      const byCat =
        activeCategory === "All Categories" ? true : p?.category === activeCategory;
      const bySearch =
        !q ||
        (p?.title || "").toLowerCase().includes(q) ||
        (p?.description || "").toLowerCase().includes(q) ||
        (p?.location || "").toLowerCase().includes(q);

      return byCat && bySearch;
    });
  }, [data.petitionsNearYou, activeCategory, search]);

  const go = (page) => onNavigate?.(page);

  return (
    <div className="dash-shell">
      {/* Top bar */}
      <div className="dash-top">
        <div className="dash-brand">
          <div className="logo-circle">C</div>
          <div>
            <div className="dash-title">CivixConnect</div>
            <div className="dash-subtitle">
              {data.user.location} • {data.user.role}
            </div>
          </div>
        </div>
        <button className="dash-logout" onClick={safeLogout}>
          Logout
        </button>
      </div>

      <div className="dash-grid">
        {/* Sidebar */}
        <aside className="dash-panel">
          <div className="dash-user">
            <div className="dash-avatar">
              {data.user.name[0]?.toUpperCase()}
            </div>
            <div className="dash-user-meta">
              <div className="dash-user-name">{data.user.name}</div>
              <div className="dash-user-loc">{data.user.location}</div>
            </div>
          </div>

          <div className="dash-nav">
            <button className="dash-nav-item active" onClick={() => go("dashboard")}>
              Dashboard
            </button>
            <button className="dash-nav-item" onClick={() => go("petitions")}>
              Petitions
            </button>
            <button className="dash-nav-item" onClick={() => go("polls")}>
              Polls
            </button>
            <button className="dash-nav-item" onClick={() => go("reports")}>
              Reports
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="dash-panel">
          <div className="dash-header">
            <div>
              <h2 className="dash-h2">Welcome back, {data.user.name}!</h2>
              <p className="dash-p">
                See what's happening in your community and make your voice heard.
              </p>
            </div>
            <button className="primary-btn dash-create" onClick={() => go("create")}>
              Create
            </button>
          </div>

          {loading && <div className="dash-msg">Loading dashboard...</div>}
          {err && <div className="dash-err">❌ {err}</div>}

          {!loading && !err && (
            <>
              {/* Stats */}
              <div className="dash-stats">
                <div className="stat glass-a">
                  <div className="stat-label">My Petitions</div>
                  <div className="stat-value">{data.stats?.myPetitions ?? 0}</div>
                  <div className="stat-sub">petitions</div>
                </div>
                <div className="stat glass-b">
                  <div className="stat-label">Successful Petitions</div>
                  <div className="stat-value">{data.stats?.successfulPetitions ?? 0}</div>
                  <div className="stat-sub">or under review</div>
                </div>
                <div className="stat glass-c">
                  <div className="stat-label">Polls Created</div>
                  <div className="stat-value">{data.stats?.pollsCreated ?? 0}</div>
                  <div className="stat-sub">polls</div>
                </div>
              </div>

              {/* Filters */}
              <div className="dash-filters">
                <div className="chips">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={cat === activeCategory ? "chip chip-active" : "chip"}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  className="dash-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search petitions..."
                />
              </div>

              {/* Petitions */}
              <div className="dash-list">
                {filteredPetitions.length === 0 ? (
                  <div className="dash-empty">
                    No petitions found matching your filters.
                  </div>
                ) : (
                  filteredPetitions.map((petition) => (
                    <div key={petition._id || petition.title} className="petition-card">
                      <div className="petition-meta">
                        {petition.category} • {petition.location} •{" "}
                        <b>{petition.status}</b>
                      </div>
                      <div className="petition-title">{petition.title}</div>
                      <div className="petition-desc">{petition.description}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
