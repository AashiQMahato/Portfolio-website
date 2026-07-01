/* eslint-env node */

const GITHUB_API_BASE = "https://api.github.com";

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
};

const buildAuthHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

const safeNumber = (n) => (typeof n === "number" && Number.isFinite(n) ? n : 0);

const toIsoDate = (d) => new Date(d).toISOString();

const aggregateLanguages = (repos) => {
  const map = new Map();
  for (const repo of repos) {
    const edges = repo?.languages?.edges || [];
    for (const edge of edges) {
      const name = edge?.node?.name;
      const size = safeNumber(edge?.size);
      if (!name || size <= 0) continue;
      map.set(name, (map.get(name) || 0) + size);
    }
  }
  return Array.from(map.entries())
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 12);
};

export default async function handler(req, res) {
  // Cache at the edge to keep the portfolio fast.
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");

  const username =
    (req?.query?.username && String(req.query.username)) || "Aashik9567";

  const token = process.env.GITHUB_TOKEN || "";

  try {
    if (token) {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 365);

      const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
				user(login: $login) {
					login
					name
					url
					avatarUrl
					bio
					followers { totalCount }
					repositories(ownerAffiliations: OWNER, first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
						totalCount
						nodes {
							name
							description
							url
							updatedAt
							stargazerCount
							forkCount
							primaryLanguage { name color }
							languages(first: 8, orderBy: {field: SIZE, direction: DESC}) {
								edges { size node { name } }
							}
						}
					}
          pullRequests(first: 1) { totalCount }
          issues(first: 1) { totalCount }
					contributionsCollection(from: $from, to: $to) {
						totalCommitContributions
						totalPullRequestContributions
						totalIssueContributions
						contributionCalendar {
							totalContributions
							weeks {
								contributionDays {
									date
									contributionCount
									contributionLevel
								}
							}
						}
					}
				}
			}`;

      const graphqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "portfolio",
          ...buildAuthHeaders(token),
        },
        body: JSON.stringify({
          query,
          variables: {
            login: username,
            from: toIsoDate(from),
            to: toIsoDate(to),
          },
        }),
      });

      if (!graphqlRes.ok) {
        const text = await graphqlRes.text();
        return json(res, 502, {
          ok: false,
          mode: "graphql",
          error: `GitHub GraphQL error (${graphqlRes.status})`,
          detail: text?.slice(0, 400),
        });
      }

      const payload = await graphqlRes.json();
      if (payload.errors?.length) {
        return json(res, 502, {
          ok: false,
          mode: "graphql",
          error: "GitHub GraphQL returned errors",
          detail: payload.errors,
        });
      }

      const user = payload?.data?.user;
      const repoNodes = user?.repositories?.nodes || [];

      const languages = aggregateLanguages(repoNodes);

      return json(res, 200, {
        ok: true,
        mode: "graphql",
        generatedAt: new Date().toISOString(),
        username,
        profile: {
          login: user?.login,
          name: user?.name,
          url: user?.url,
          avatarUrl: user?.avatarUrl,
          bio: user?.bio,
          followers: safeNumber(user?.followers?.totalCount),
          publicRepos: safeNumber(user?.repositories?.totalCount),
        },
        repos: repoNodes.map((r) => ({
          name: r?.name,
          description: r?.description,
          url: r?.url,
          updatedAt: r?.updatedAt,
          stars: safeNumber(r?.stargazerCount),
          forks: safeNumber(r?.forkCount),
          language: r?.primaryLanguage?.name || null,
        })),
        languages,
        contributions: {
          total: safeNumber(
            user?.contributionsCollection?.contributionCalendar
              ?.totalContributions,
          ),
          weeks:
            user?.contributionsCollection?.contributionCalendar?.weeks || [],
        },
        stats: {
          commits: safeNumber(
            user?.contributionsCollection?.totalCommitContributions,
          ),
          prContributions: safeNumber(
            user?.contributionsCollection?.totalPullRequestContributions,
          ),
          issueContributions: safeNumber(
            user?.contributionsCollection?.totalIssueContributions,
          ),
          pullRequestsOpened: safeNumber(user?.pullRequests?.totalCount),
          issuesOpened: safeNumber(user?.issues?.totalCount),
        },
      });
    }

    // REST fallback (no token): profile + repos + events
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${username}`, {
        headers: {
          "User-Agent": "portfolio",
        },
      }),
      fetch(
        `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=8`,
        {
          headers: {
            "User-Agent": "portfolio",
          },
        },
      ),
      fetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=12`, {
        headers: {
          "User-Agent": "portfolio",
        },
      }),
    ]);

    const profile = profileRes.ok ? await profileRes.json() : null;
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    return json(res, 200, {
      ok: true,
      mode: "rest",
      generatedAt: new Date().toISOString(),
      username,
      profile: profile
        ? {
            login: profile?.login,
            name: profile?.name,
            url: profile?.html_url,
            avatarUrl: profile?.avatar_url,
            bio: profile?.bio,
            followers: safeNumber(profile?.followers),
            publicRepos: safeNumber(profile?.public_repos),
          }
        : null,
      repos: Array.isArray(repos)
        ? repos.map((r) => ({
            name: r?.name,
            description: r?.description,
            url: r?.html_url,
            updatedAt: r?.updated_at,
            stars: safeNumber(r?.stargazers_count),
            forks: safeNumber(r?.forks_count),
            language: r?.language || null,
          }))
        : [],
      events: Array.isArray(events)
        ? events.map((e) => ({
            id: e?.id,
            type: e?.type,
            repo: e?.repo?.name,
            createdAt: e?.created_at,
            payload: e?.payload,
          }))
        : [],
      contributions: null,
      languages: null,
      stats: null,
      note: "Set GITHUB_TOKEN on Vercel to enable live contribution heatmap + richer stats.",
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Failed to fetch GitHub data",
      detail: String(err?.message || err),
    });
  }
}
