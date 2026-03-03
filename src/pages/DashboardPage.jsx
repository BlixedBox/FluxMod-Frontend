import React, { useEffect, useState } from "react";
import "../Styles/dashboard.css";
import "../Styles/defaults.css";

export default function DashboardPage({ user }) {
  const username = user?.username || user?.id || "User";

  const [guilds, setGuilds] = useState([]);
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(true);
  const [guildsError, setGuildsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGuilds = async () => {
      setIsLoadingGuilds(true);
      setGuildsError("");

      try {
        const response = await fetch("/api/guilds", {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`Failed to load guilds (${response.status})`);
        }

        const data = await response.json();

        if (isMounted) {
          setGuilds(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setGuildsError(error?.message || "Unable to load guilds.");
          setGuilds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingGuilds(false);
        }
      }
    };

    loadGuilds();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">Welcome back</p>
            <p className="user-greeting">{username}</p>
          </div>

          <div className="nav-section">
            <span className="section-title">General</span>
            <ul>
              <li><a href="/dashboard/servers"><i className="fa-solid fa-server"></i><span>Servers</span></a></li>
              <li><a href="/dashboard/settings"><i className="fa-solid fa-gear"></i><span>Settings</span></a></li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="section-title">Management</span>
            <ul>
              <li><a href="/dashboard/automod"><i className="fa-solid fa-robot"></i><span>AutoMod</span></a></li>
            </ul>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Your Guilds</h1>
        <br />
        <div className="dashboard-grid">
          {isLoadingGuilds && <p className="subtitle">Loading guilds...</p>}

          {!isLoadingGuilds && guildsError && (
            <p className="subtitle">{guildsError}</p>
          )}

          {!isLoadingGuilds && !guildsError && guilds.length === 0 && (
            <p className="subtitle">No guilds found for this account.</p>
          )}

          {!isLoadingGuilds &&
            !guildsError &&
            guilds.map((guild) => (
              <div className="dashboard-card" key={guild.id}>
                <div className="card-icon servers-icon">
                  <i className="fa-solid fa-server"></i>
                </div>
                <h3>{guild.name || "Unnamed Guild"}</h3>
                <p className="card-label">ID: {guild.id}</p>
              </div>
            ))}
        </div>
      </main>
    </section>
  );
}