import { useEffect, useState } from "react";
import "../Styles/defaults.css";
import "../Styles/contributors.css";

const owner = "BlixedBox";
const repos = ["FluxMod-Frontend", "FluxMod-Backend", "FluxMod-Bot"];
const maintainers = ["unclemelo", "pitr1010", "2chainzz", "8-bit-ball", "Bunn001"];

export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadContributors() {
      try {
        setErrorMessage("");

        const repoContributors = await Promise.all(
          repos.map(async (repo) => {
            const res = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`
            );

            if (!res.ok) {
              throw new Error(`Contributors fetch failed for ${repo}: ${res.status}`);
            }

            return res.json();
          })
        );

        const mergedContributors = new Map();
        for (const contributorsForRepo of repoContributors) {
          for (const contributor of contributorsForRepo) {
            const existing = mergedContributors.get(contributor.login);
            if (existing) {
              existing.contributions += contributor.contributions || 0;
            } else {
              mergedContributors.set(contributor.login, {
                login: contributor.login,
                contributions: contributor.contributions || 0,
                avatar_url: contributor.avatar_url,
                url: contributor.url,
              });
            }
          }
        }

        const baseContributors = Array.from(mergedContributors.values()).sort(
          (left, right) => right.contributions - left.contributions
        );

        const profiles = await Promise.all(
          baseContributors.map(async (contributor) => {
            try {
              const profileResponse = await fetch(contributor.url);
              if (!profileResponse.ok) {
                return {
                  login: contributor.login,
                  contributions: contributor.contributions,
                  name: null,
                  avatarUrl: contributor.avatar_url,
                };
              }

              const profile = await profileResponse.json();
              return {
                login: contributor.login,
                contributions: contributor.contributions,
                name: profile.name || null,
                avatarUrl: profile.avatar_url,
              };
            } catch {
              return {
                login: contributor.login,
                contributions: contributor.contributions,
                name: null,
                avatarUrl: contributor.avatar_url,
              };
            }
          })
        );

        if (!isCancelled) {
          setContributors(profiles);
        }
      } catch (error) {
        console.error("Error loading contributors:", error);
        if (!isCancelled) {
          setErrorMessage("Unable to load contributors. Please try again later.");
        }
      }
    }

    loadContributors();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="page-card">
      <h2>Contributors</h2><br/>
      <p className="muted">People helping build FluxMod.</p>

      {errorMessage ? (
        <p className="muted">{errorMessage}</p>
      ) : (
        <div className="grid-container" aria-live="polite">
          {contributors.map((contributor) => {
            const normalizedLogin = contributor.login.toLowerCase();
            const role = maintainers.includes(normalizedLogin)
              ? "Maintainer"
              : "Contributor";

            return (
              <article className="contributor-card" key={contributor.login}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={contributor.avatarUrl} alt={contributor.login} />
                  <div>
                    <div className="contributor-name">
                      {contributor.name || contributor.login}
                    </div>
                    <div className="contributor-role">{role}</div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Commits: {contributor.contributions}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}