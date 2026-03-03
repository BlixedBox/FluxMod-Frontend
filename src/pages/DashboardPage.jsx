import React from "react";
import "../Styles/dashboard.css";
import "../Styles/defaults.css";

export default function DashboardPage({ user }) {
  const username = user?.username || user?.id || "User";
  const guilds = Array.isArray(user?.guilds) ? user.guilds : [];

  const getGuildIconUrl = (guild) => {
    if (!guild) {
      return "";
    }

    if (guild.iconUrl || guild.icon_url) {
      return guild.iconUrl || guild.icon_url;
    }

    if (guild.icon && guild.id) {
      return `https://fluxerusercontent.com/icons/${guild.id}/${guild.icon}.png`;
    }

    return "";
  };

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
          {guilds.length === 0 && (
            <p className="subtitle">No guilds found for this account.</p>
          )}

          {guilds.map((guild) => {
            const guildIconUrl = getGuildIconUrl(guild);

            return (
              <div className="dashboard-card" key={guild.id}>
                {guildIconUrl ? (
                  <img
                    className="guild-icon-image"
                    src={guildIconUrl}
                    alt={`${guild.name || "Guild"} icon`}
                    loading="lazy"
                  />
                ) : (
                  <div className="card-icon servers-icon">
                    <i className="fa-solid fa-server"></i>
                  </div>
                )}
                <h3>{guild.name || "Unnamed Guild"}</h3>
                <p className="card-label">ID: {guild.id}</p>
              </div>
            );
          })}
        </div>
      </main>
    </section>
  );
}