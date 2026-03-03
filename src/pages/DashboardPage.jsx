import React, { useState } from "react";
import "../Styles/dashboard.css";
import "../Styles/defaults.css";

export default function DashboardPage({ user, guildId }) {

  const username = user?.username || user?.id || "User";

  const [commandStates, setCommandStates] = useState({
    kick: true,
    ban: true,
    mute: true,
    warn: true
  });

  const toggleCommand = (commandKey) => {
    const newValue = !commandStates[commandKey];

    setCommandStates(prev => ({
      ...prev,
      [commandKey]: newValue
    }));

    fetch("/api/update-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guildId,
        command: commandKey,
        enabled: newValue
      })
    });
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
        <h1>Commands</h1>
        <br />
        <div className="dashboard-grid">
            {[
                { name: "Kick", icon: "fa-user-slash", key: "kick", desc: "Remove a member from the server" },
                { name: "Ban", icon: "fa-hammer", key: "ban", desc: "Permanently ban a member" },
                { name: "Mute", icon: "fa-volume-xmark", key: "mute", desc: "Timeout a member temporarily" },
                { name: "Warn", icon: "fa-triangle-exclamation", key: "warn", desc: "Issue a warning to a member" },
                { name: "Purge", icon: "fa-broom", key: "purge", desc: "Bulk delete messages in a channel" },
                { name: "AutoMod", icon: "fa-robot", key: "automod", desc: "Automatically moderate content based on rules" }
            ].map((command) => (
                <div className="command-card" key={command.key}>
                
                <div className="command-left">
                    <div className="card-icon">
                    <i className={`fa-solid ${command.icon}`}></i>
                    </div>

                    <div className="command-info">
                    <h3>{command.name}</h3>
                    <p className="command-description">{command.desc}</p>
                    </div>
                </div>

                <label className="toggle-switch">
                    <input
                    type="checkbox"
                    checked={commandStates[command.key]}
                    onChange={() => toggleCommand(command.key)}
                    />
                    <span className="slider"></span>
                </label>

                </div>
            ))}
        </div>
      </main>
    </section>
  );
}