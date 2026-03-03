import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/dashboard.css";
import "../Styles/defaults.css";

export default function DashboardPage({ user }) {
  const navigate = useNavigate();
  const username = user?.username || user?.id || "User";
  const guilds = Array.isArray(user?.guilds) ? user.guilds : [];

  const DEFAULT_USER_PFP = "/images/default-user.png"; // fallback avatar
  const DEFAULT_GUILD_ICON = "/images/default-guild.png"; // fallback guild icon

  const getGuildId = (guild) =>
    guild?.id || guild?.guild_id || guild?.guildId || guild?.discord_id || "";

  const getGuildName = (guild) =>
    guild?.name || guild?.guild_name || guild?.guildName || "Unnamed Guild";

  const getGuildIconUrl = (guild) => {
    const guildId = getGuildId(guild);
    if (!guild || !guildId) return "/images/default-guild.png";
    if (guild.icon) {
        const isAnimated = guild.icon.startsWith("a_");
        const format = isAnimated ? "gif" : "png";
        return `https://fluxerusercontent.com/icons/${guildId}/${guild.icon}.${format}`;
    }
    return "/images/default-guild.png"; // fallback
    };

  const getUserPfpUrl = (user) => {
    if (!user || !user.id) return "/images/default-user.png";
    if (user.avatar_url) {
        const isAnimated = user.avatar_url.startsWith("a_");
        const format = isAnimated ? "gif" : "png";
        return `https://fluxerusercontent.com/avatars/${user.id}/${user.avatar_url}.${format}`;
    }
    return "/images/default-user.png"; // fallback
    };

  const handleGuildClick = (guildId) => {
    if (!guildId) {
      return;
    }

    navigate(`/dashboard/guild?guild_id=${encodeURIComponent(guildId)}`);
  };

  return (
    <section className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">Welcome back</p>
            <div className="user-profile">
              <img
                className="user-pfp"
                src={getUserPfpUrl(user)}
                alt={`${username} profile`}
                loading="lazy"
                onError={(e) => (e.target.src = DEFAULT_USER_PFP)}
              />
              <p className="user-greeting">{username}</p>
            </div>
          </div>

          <div className="nav-section">
            <span className="section-title">General</span>
            <ul>
              <li>
                <a className="sidebar-active">
                  <i className="fa-solid fa-server"></i>
                  <span>Servers</span>
                </a>
              </li>
              <li>
                <a href="/dashboard/settings">
                  <i className="fa-solid fa-gear"></i>
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="section-title">Management</span>
            <ul>
              <li>
                <a href="/dashboard/automod">
                  <i className="fa-solid fa-robot"></i>
                  <span>AutoMod</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <div className="dashboard-grid">
          {guilds.length === 0 && (
            <p className="subtitle">No guilds found for this account.</p>
          )}

          {guilds.map((guild, index) => {
            const guildIconUrl = getGuildIconUrl(guild);
            const guildId = getGuildId(guild);
            const guildName = getGuildName(guild);
            const guildKey = guildId || `guild-${index}`;

            return (
              <div
                className="dashboard-card"
                key={guildKey}
                onClick={() => handleGuildClick(guildId)}
              >
                {guildIconUrl ? (
                  <img
                    className="guild-icon-image"
                    src={guildIconUrl}
                    alt={`${guildName || "Guild"} icon`}
                    loading="lazy"
                    onError={(e) => (e.target.src = DEFAULT_GUILD_ICON)}
                  />
                ) : (
                  <div className="card-icon servers-icon">
                    <i className="fa-solid fa-server"></i>
                  </div>
                )}
                <h3>{guildName}</h3>
                <p className="card-label">ID: {guildId || "Unavailable"}</p>
              </div>
            );
          })}
        </div>
      </main>
    </section>
  );
}