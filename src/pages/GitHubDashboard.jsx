import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowUpRight, Star, GitFork } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Reveal, SplitText } from "../motion";

const GITHUB_USERNAME = "AashiQMahato";
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const levelToIndex = (level) => {
  const map = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  if (typeof level === "number") return Math.max(0, Math.min(4, level));
  return map[level] ?? 0;
};

const HEAT = ["bg-line", "bg-signal/25", "bg-signal/50", "bg-signal/75", "bg-signal"];

const HeatmapCell = ({ level, title }) => (
  <div title={title} className={`h-3 w-3 rounded-[2px] ${HEAT[levelToIndex(level)]}`} />
);

HeatmapCell.propTypes = {
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
};

// Chart chrome reads the live theme tokens, so both themes recolor for free.
const TOOLTIP = {
  contentStyle: {
    backgroundColor: "rgb(var(--panel))",
    border: "1px solid rgb(var(--line))",
    borderRadius: 8,
    color: "rgb(var(--ink))",
  },
  labelStyle: { color: "rgb(var(--ink-dim))" },
  itemStyle: { color: "rgb(var(--ink))" },
};

const SectionHead = ({ title, meta }) => (
  <div className="mb-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
    <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
    {meta && <p className="hud">{meta}</p>}
  </div>
);

SectionHead.propTypes = {
  title: PropTypes.string.isRequired,
  meta: PropTypes.string,
};

const formatEvent = (e) => {
  if (!e) return null;
  const repo = e.repo || "";
  const type = e.type || "";
  const createdAt = e.createdAt;
  const payload = e.payload || {};

  if (type === "PushEvent") {
    const commits = Array.isArray(payload.commits) ? payload.commits : [];
    return {
      title: `Pushed ${commits.length} commit${commits.length === 1 ? "" : "s"}`,
      subtitle: repo,
      meta: commits[0]?.message ? commits[0].message.slice(0, 70) : "",
      createdAt,
    };
  }

  if (type === "PullRequestEvent") {
    const action = payload.action ? String(payload.action) : "updated";
    return {
      title: `Pull request ${action}`,
      subtitle: repo,
      meta: payload.pull_request?.title || "",
      createdAt,
    };
  }

  if (type === "IssuesEvent") {
    const action = payload.action ? String(payload.action) : "updated";
    return {
      title: `Issue ${action}`,
      subtitle: repo,
      meta: payload.issue?.title || "",
      createdAt,
    };
  }

  return {
    title: type.replace(/Event$/, ""),
    subtitle: repo,
    meta: "",
    createdAt,
  };
};

const timeAgo = (iso) => {
  const ts = iso ? new Date(iso).getTime() : 0;
  if (!ts) return "";
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const GitHubDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [mode, setMode] = useState("rest");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setError("");

        // Prefer our serverless proxy (caching + optional token for GraphQL).
        let data = null;
        try {
          const res = await fetch(`/api/github?username=${GITHUB_USERNAME}`);
          if (res.ok) data = await res.json();
        } catch {
          // ignored
        }

        // Fallback: direct REST (works on static hosting, but rate-limited)
        if (!data?.ok) {
          const [profileRes, reposRes, eventsRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetch(
              `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8`,
            ),
            fetch(
              `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=12`,
            ),
          ]);

          if (!profileRes.ok || !reposRes.ok) {
            throw new Error("GitHub API request failed");
          }

          const profileData = await profileRes.json();
          const reposData = await reposRes.json();
          const eventsData = eventsRes.ok ? await eventsRes.json() : [];

          setProfile({
            login: profileData.login,
            name: profileData.name,
            url: profileData.html_url,
            avatarUrl: profileData.avatar_url,
            bio: profileData.bio,
            followers: profileData.followers,
            publicRepos: profileData.public_repos,
          });
          setRepos(
            Array.isArray(reposData)
              ? reposData.map((r) => ({
                  name: r.name,
                  description: r.description,
                  url: r.html_url,
                  updatedAt: r.updated_at,
                  stars: r.stargazers_count,
                  forks: r.forks_count,
                  language: r.language,
                }))
              : [],
          );
          setEvents(
            Array.isArray(eventsData)
              ? eventsData
                  .map((e) =>
                    formatEvent({
                      id: e.id,
                      type: e.type,
                      repo: e.repo?.name,
                      createdAt: e.created_at,
                      payload: e.payload,
                    }),
                  )
                  .filter(Boolean)
              : [],
          );
          setMode("rest");
          setNote(
            "Direct GitHub REST mode (limited rate + no yearly heatmap).",
          );
          return;
        }

        setMode(data.mode || "rest");
        setNote(data.note || "");
        setProfile(data.profile);
        setRepos(Array.isArray(data.repos) ? data.repos : []);
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
        setContributions(data.contributions || null);
        setStats(data.stats || null);

        // Ensure activity feed is always live.
        if (Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events.map(formatEvent).filter(Boolean));
        } else {
          const evRes = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=12`,
          );
          const evJson = evRes.ok ? await evRes.json() : [];
          setEvents(
            Array.isArray(evJson)
              ? evJson
                  .map((e) =>
                    formatEvent({
                      id: e.id,
                      type: e.type,
                      repo: e.repo?.name,
                      createdAt: e.created_at,
                      payload: e.payload,
                    }),
                  )
                  .filter(Boolean)
              : [],
          );
        }
      } catch (error) {
        console.error("Failed to fetch GitHub data", error);
        setError("Unable to load GitHub data right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const profileUrl = profile?.url || PROFILE_URL;
  const recentEvents = events.slice(0, 6);
  const figures = [
    { label: "Repositories", value: profile?.publicRepos || 0 },
    { label: "Followers", value: profile?.followers || 0 },
    ...(stats?.commits != null ? [{ label: "Commits (1y)", value: stats.commits }] : []),
  ];

  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="max-w-5xl">
        <Reveal variant="fade">
          <p className="hud">(GitHub) — Live from the GitHub API</p>
        </Reveal>
        <Reveal variant="lines" className="mt-6">
          <SplitText as="h1" text="GitHub" className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-2xl text-lede text-ink-dim">
            Repositories, languages and recent public activity, fetched live from @{GITHUB_USERNAME}.
          </p>
        </Reveal>
      </header>

      {loading ? (
        <div role="status" className="mt-[clamp(4rem,10vh,7rem)] flex items-center gap-3 border-t border-line pt-8">
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-signal border-t-transparent"
          />
          <span className="hud">Loading GitHub data…</span>
        </div>
      ) : (
        <>
          <Reveal
            variant="rise"
            className="mt-[clamp(4rem,10vh,7rem)] grid items-center gap-8 border-y border-line py-8 md:grid-cols-12">
            <div className="flex items-center gap-5 md:col-span-5">
              <img
                src={profile?.avatarUrl || `https://github.com/identicons/${GITHUB_USERNAME}.png`}
                alt=""
                width="64"
                height="64"
                className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-xl font-semibold tracking-tight text-ink">
                  {profile?.name || GITHUB_USERNAME}
                </p>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line mt-1 inline-flex items-center gap-1 text-ink-dim transition-colors hover:text-ink">
                  @{profile?.login || GITHUB_USERNAME}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <p className="hud mt-2">
                  Mode: {mode}
                  {note && <span className="normal-case tracking-normal"> · {note}</span>}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-3 md:col-span-7">
              {figures.map((s, i) => (
                <div key={s.label} className={`flex flex-col gap-2 px-4 ${i ? "border-l border-line" : "pl-0"}`}>
                  <dt className="hud">{s.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight tabular-nums text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {error && (
            <p role="alert" className="panel mt-8 flex items-center gap-3 p-4 text-sm text-ink-dim">
              <span className="hud text-accent-ink">Error</span>
              {error}
            </p>
          )}

          <div className="mt-[clamp(3rem,8vh,5rem)] grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-14 lg:col-span-8">
              <Reveal as="section" variant="rise">
                <SectionHead title="Contribution activity" meta="Last year" />
                <div className="panel p-6">
                  {contributions?.weeks ? (
                    <div className="overflow-x-auto pb-2">
                      <div className="flex min-w-max gap-1">
                        {contributions.weeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-1">
                            {week.contributionDays.map((day, dIdx) => (
                              <HeatmapCell
                                key={`${wIdx}-${dIdx}`}
                                level={day.contributionLevel}
                                title={`${day.date}: ${day.contributionCount} contributions`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-dim">
                      Live yearly heatmap requires a GitHub token on the server.
                    </p>
                  )}
                  <div aria-hidden="true" className="hud mt-4 flex items-center justify-end gap-2">
                    <span>Less</span>
                    {HEAT.map((_, level) => (
                      <HeatmapCell key={level} level={level} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </Reveal>

              <Reveal as="section" variant="rise">
                <SectionHead title="Languages" meta="Top 8 · bytes" />
                <div className="panel h-[320px] p-6">
                  {languages.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={languages.slice(0, 8).map((l) => ({ name: l.name, bytes: l.bytes }))}
                        layout="vertical"
                        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid horizontal={false} stroke="rgb(var(--line))" />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          width={90}
                          tick={{ fontSize: 12, fill: "rgb(var(--ink-dim))" }}
                        />
                        <Tooltip
                          {...TOOLTIP}
                          cursor={{ fill: "rgb(var(--line) / 0.5)" }}
                          formatter={(v) => [v, "bytes"]}
                        />
                        <Bar dataKey="bytes" fill="rgb(var(--signal))" radius={[0, 2, 2, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="flex h-full items-center justify-center text-sm text-ink-dim">
                      Language analytics available with server token.
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal as="section" variant="rise">
                <SectionHead title="Recent repositories" meta={`${repos.length} shown`} />
                <ul className="divide-y divide-line border-b border-line">
                  {repos.map((repo) => (
                    <li key={repo.url || repo.name}>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                        <div className="min-w-0 sm:col-span-8">
                          <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                            {repo.name}
                            <ArrowUpRight
                              className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                              aria-hidden="true"
                            />
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-ink-dim">
                            {repo.description || "No description provided."}
                          </p>
                        </div>
                        <p className="hud flex items-center gap-4 sm:col-span-4 sm:justify-end">
                          {repo.language && <span>{repo.language}</span>}
                          <span className="flex items-center gap-1 tabular-nums">
                            <Star className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Stars</span>
                            {repo.stars ?? 0}
                          </span>
                          <span className="flex items-center gap-1 tabular-nums">
                            <GitFork className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Forks</span>
                            {repo.forks ?? 0}
                          </span>
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <aside className="space-y-14 lg:col-span-4">
              <Reveal as="section" variant="rise">
                <SectionHead title="About" />
                <p className="text-ink-dim">{profile?.bio || "No bio available."}</p>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110">
                  View full profile
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Reveal>

              <Reveal as="section" variant="rise">
                <SectionHead title="Recent activity" />
                {recentEvents.length > 0 ? (
                  <ol className="divide-y divide-line border-b border-line">
                    {recentEvents.map((ev, i) => (
                      <li key={i} className="py-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate text-sm font-medium text-ink">{ev.title}</p>
                          <p className="hud shrink-0 tabular-nums">{timeAgo(ev.createdAt)}</p>
                        </div>
                        <p className="mt-1 truncate text-sm text-ink-dim">{ev.subtitle}</p>
                        {ev.meta && <p className="mt-1 line-clamp-1 text-sm text-ink-dim">{ev.meta}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-ink-dim">No recent public activity available.</p>
                )}
              </Reveal>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubDashboard;
