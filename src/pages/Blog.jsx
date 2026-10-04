import { useState } from "react";
import { Reveal, SplitText } from "../motion";
import { FeaturedPost, PostList } from "../components/ui";
import { blogPosts } from "../data/blogPosts";
import { CV } from "../data/portfolioData";

const byDate = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
const CATEGORIES = ["All", ...new Set(byDate.map((p) => p.category))];

/** Blog index: editorial lead article + hairline index with hover covers. */
const Blog = () => {
  const [category, setCategory] = useState("All");
  const posts = category === "All" ? byDate : byDate.filter((p) => p.category === category);
  const [lead, ...rest] = posts;

  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="mb-[clamp(3rem,8vh,5rem)]">
        <Reveal variant="fade" className="mb-6">
          <p className="hud">
            <span className="tabular-nums text-ink">({String(blogPosts.length).padStart(2, "0")})</span> — Writing
          </p>
        </Reveal>
        <Reveal variant="lines">
          <SplitText as="h1" lines={["Notes from", "the workbench."]} className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-xl text-lede text-ink-dim">
            Technical write-ups from building across hardware, the web and interaction — what
            worked, with the code to prove it.
          </p>
        </Reveal>
      </header>

      {CATEGORIES.length > 2 && (
        <div role="group" aria-label="Filter by topic" className="mb-12 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`min-h-11 rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 md:min-h-0 ${
                category === c ? "border-ink bg-ink text-background" : "border-line text-ink-dim hover:border-ink-dim hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {lead && <FeaturedPost post={lead} headingLevel="h2" />}
      {rest.length > 0 && (
        <div className="mt-[clamp(4rem,10vh,7rem)]">
          <PostList posts={rest} startIndex={2} headingLevel="h2" />
        </div>
      )}

      <p className="hud mt-16">
        More in progress —{" "}
        <a href={CV.contact.github} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
          follow along on GitHub
        </a>
      </p>
    </div>
  );
};

export default Blog;
