import { useEffect, useState } from "react";
import "../Styles/defaults.css";
import "../Styles/landing.css"
import FluxModLogo from "./static-imgs/fluxmod.png";
import "../Styles/dashboard.css";

export default function HomePage({ isAuthenticated, onLogin }) {
  const [guildCount, setGuildCount] = useState("0");
  const [commitCount, setCommitCount] = useState("0");
  const [uptimeDisplay, setUptimeDisplay] = useState("—");
  const [uptimeLabel, setUptimeLabel] = useState("Current health");

  useEffect(() => {
    let isMounted = true;

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const endpoint = isLocalhost
      ? "http://localhost:8000/api/bot/guild-count"
      : "https://api.fluxmod.app/api/bot/guild-count";

    async function loadGuildCount() {
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const count = Number(data?.count);

        if (isMounted && Number.isFinite(count)) {
          setGuildCount(String(count));
        }
      } catch {
        // Keep fallback value
      }
    }

    loadGuildCount();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const endpoint = isLocalhost
      ? "http://localhost:8000/healthz"
      : "https://api.fluxmod.app/healthz";

    async function loadUptime() {
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
        });

        if (!response.ok) {
          if (isMounted) {
            setUptimeDisplay("Down");
            setUptimeLabel("Current health");
          }
          return;
        }

        const payload = await response.json().catch(() => null);
        const rawPercent =
          payload?.uptime24h ??
          payload?.uptime_24h ??
          payload?.uptimePercent ??
          payload?.uptime_percent;
        const parsedPercent = Number(rawPercent);

        if (isMounted) {
          if (Number.isFinite(parsedPercent)) {
            setUptimeDisplay(`${parsedPercent.toFixed(2)}%`);
            setUptimeLabel("Within the last 24 hours");
            return;
          }

          const statusValue = String(payload?.status || "").toLowerCase();
          setUptimeDisplay(statusValue === "ok" ? "Up" : "Down");
          setUptimeLabel("Current health");
        }
      } catch {
        if (isMounted) {
          setUptimeDisplay("—");
          setUptimeLabel("Current health unavailable");
        }
      }
    }

    loadUptime();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const owner = "BlixedBox";
    const repos = ["FluxMod-Frontend", "FluxMod-Backend", "FluxMod-Bot"];
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    async function fetchRepoCommitCount(repo) {
      let page = 1;
      let count = 0;
      const perPage = 100;

      while (page <= 10) {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?since=${encodeURIComponent(since)}&per_page=${perPage}&page=${page}`
        );

        if (!response.ok) {
          return count;
        }

        const commits = await response.json();
        if (!Array.isArray(commits) || commits.length === 0) {
          break;
        }

        count += commits.length;

        if (commits.length < perPage) {
          break;
        }

        page += 1;
      }

      return count;
    }

    async function loadCommitCount() {
      try {
        const counts = await Promise.all(repos.map((repo) => fetchRepoCommitCount(repo)));
        const total = counts.reduce((sum, value) => sum + value, 0);

        if (isMounted && Number.isFinite(total)) {
          setCommitCount(String(total));
        }
      } catch {
        // Keep fallback value
      }
    }

    loadCommitCount();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-layout">
      <section className="title-card">
          <img className="fluxmod-logo" src={FluxModLogo} alt="FluxMod Logo" />
          <h1>FluxMod / Dashboard</h1>
          <p className="title-desc">Your all-in-one AutoMod solution for Fluxer guilds.</p>
          <button
            type="button"
            className="login-w-fluxer"
            id="login"
            onClick={onLogin}
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i>{" "}
            {isAuthenticated ? "Switch Account" : "Login with Fluxer"}
          </button>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon servers-icon">
            <i className="fa-solid fa-server"></i>
          </div>
          <h3>Servers</h3>
          <p className="card-stat">{guildCount}</p>
          <p className="card-label">Inactive</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon analytics-icon">
            <i className="fa-solid fa-gauge"></i>
          </div>
          <h3>Uptime</h3>
          <p className="card-stat">{uptimeDisplay}</p>
          <p className="card-label">{uptimeLabel}</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon logs-icon">
            <i className="fa-solid fa-file-alt"></i>
          </div>
          <h3>Commits</h3>
          <p className="card-stat">{commitCount}</p>
          <p className="card-label">Within the last 24 hours</p>
        </div>
      </div>

      {/* <section className="stat-card hero-stat">
          <div className="stat-content">
            <span className="stat-label">Protected Servers</span>
            <span className="stat-value" id="protected-guilds-count">—</span>
          </div>
      </section> */}
    </div>
  );
}
