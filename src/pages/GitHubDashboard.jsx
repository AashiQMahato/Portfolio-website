import React, { useEffect, useState } from "react";
import {
  Github,
  Star,
  GitFork,
  BookOpen,
  Activity,
  GitCommit,
  Link as LinkIcon,
  AlertTriangle,
  Code2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScrollReveal } from "../components/ui";

const GITHUB_USERNAME = "AashiQMahato";

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

const HeatmapCell = ({ level, title }) => {
  const idx = levelToIndex(level);
  const colors = {
    0: "bg-border/40",
    1: "bg-primary/15",
    2: "bg-primary/30",
    3: "bg-primary/50",
    4: "bg-primary",
  };
  return (
    <div
      title={title}
      className={`w-3 h-3 rounded-sm ${colors[idx]} transition-colors hover:ring-1 hover:ring-primary/60`}
    />
  );
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl section-padding pt-28">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border border-border p-1 bg-card/50 overflow-hidden shadow-xl">
              <img
                src={
                  profile?.avatarUrl ||
                  "https://github.com/identicons/AashiQMahato.png"
                }
                alt="GitHub Avatar"
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">
                {profile?.name || GITHUB_USERNAME}
              </h1>
              <a
                href={profile?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mt-1">
                @{profile?.login || GITHUB_USERNAME}{" "}
                <LinkIcon className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full border border-border bg-card/40">
                  Mode: {mode}
                </span>
                {note && <span className="opacity-80">• {note}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center px-6 py-3 rounded-2xl bg-card/40 border border-border">
              <div className="text-2xl font-bold text-foreground">
                {profile?.publicRepos || 0}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                Repositories
              </div>
            </div>
            <div className="text-center px-6 py-3 rounded-2xl bg-card/40 border border-border">
              <div className="text-2xl font-bold text-foreground">
                {profile?.followers || 0}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                Followers
              </div>
            </div>
            {stats?.commits != null && (
              <div className="text-center px-6 py-3 rounded-2xl bg-card/40 border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {stats.commits}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                  Commits (1y)
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {error && (
          <div className="mb-10 p-4 rounded-2xl border border-border bg-card/40 flex items-center gap-3 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-primary" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Heatmap & Repos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contribution Heatmap */}
            <ScrollReveal delay={0.1}>
              <div className="p-6 rounded-3xl border border-border bg-card/40">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Contribution
                    Activity
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    Last year
                  </span>
                </div>

                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-1 min-w-max">
                    {contributions?.weeks ? (
                      contributions.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1">
                          {week.contributionDays.map((day, dIdx) => (
                            <HeatmapCell
                              key={`${wIdx}-${dIdx}`}
                              level={day.contributionLevel}
                              title={`${day.date}: ${day.contributionCount} contributions`}
                            />
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl border border-border bg-background/30 text-sm text-muted-foreground">
                        Live yearly heatmap requires a GitHub token on the
                        server.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-4">
                  <span>Less</span>
                  <HeatmapCell level={0} />
                  <HeatmapCell level={1} />
                  <HeatmapCell level={2} />
                  <HeatmapCell level={3} />
                  <HeatmapCell level={4} />
                  <span>More</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Language distribution */}
            <ScrollReveal delay={0.15}>
              <div className="p-6 rounded-3xl border border-border bg-card/40 h-[320px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" /> Language
                    distribution
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Top languages
                  </span>
                </div>
                <div className="flex-1 min-h-0">
                  {Array.isArray(languages) && languages.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={languages
                          .slice(0, 8)
                          .map((l) => ({ name: l.name, bytes: l.bytes }))}
                        layout="vertical"
                        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="rgb(var(--border) / 0.55)"
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          width={90}
                          tick={{
                            fontSize: 12,
                            fill: "rgb(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            borderColor: "rgb(var(--border))",
                            borderRadius: 12,
                          }}
                          itemStyle={{ color: "rgb(var(--foreground))" }}
                          formatter={(v) => [v, "bytes"]}
                        />
                        <Bar
                          dataKey="bytes"
                          fill="rgb(var(--primary))"
                          radius={[0, 6, 6, 0]}
                          barSize={18}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      Language analytics available with server token.
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Repositories */}
            <ScrollReveal delay={0.2}>
              <div className="flex items-center justify-between mb-6 mt-10">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Recent
                  Repositories
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.url || repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-2xl border border-border bg-card/20 hover:bg-card/60 hover:border-primary/30 transition-all group">
                    <h3 className="font-bold mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />{" "}
                      {repo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />{" "}
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> {repo.stars ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" /> {repo.forks ?? 0}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScrollReveal delay={0.3}>
              <div className="p-6 rounded-3xl border border-border bg-card/40">
                <h2 className="text-lg font-bold font-display mb-4">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {profile?.bio || "No bio available."}
                </p>
                <a
                  href={profile?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Github className="w-4 h-4" /> View Full Profile
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="p-6 rounded-3xl border border-border bg-card/40">
                <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-accent" /> Recent Activity
                </h2>
                <div className="space-y-4">
                  {(events.length ? events.slice(0, 6) : []).map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        {i !== Math.min(events.length, 6) - 1 && (
                          <div className="w-px h-10 bg-border my-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {ev.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {ev.subtitle}
                        </div>
                        {ev.meta && (
                          <div className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-1">
                            {ev.meta}
                          </div>
                        )}
                        <div className="text-[10px] text-muted-foreground/60 mt-1">
                          {timeAgo(ev.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {events.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No recent public activity available.
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubDashboard;
