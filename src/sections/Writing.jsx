import { Link } from "react-router-dom";
import { SectionHeader, FeaturedPost, PostList } from "../components/ui";
import { blogPosts } from "../data/blogPosts";

const byDate = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

/** Writing: one lead article, the rest as an index with hover previews. */
const Writing = () => {
  const [lead, ...rest] = byDate;
  return (
    <section id="writing" aria-labelledby="writing-title" className="relative py-[clamp(7rem,16vh,13rem)]">
      <div className="shell">
        <SectionHeader
          index="06"
          avatar={{ mood: "listening", hover: "curious" }}
          label="Writing"
          id="writing-title"
          title={["Notes from", "the workbench."]}
          aside={
            <Link to="/blog" className="link-line text-sm text-ink-dim hover:text-ink">
              All articles ({blogPosts.length}) →
            </Link>
          }
        />
        {lead && <FeaturedPost post={lead} />}
        {rest.length > 0 && (
          <div className="mt-[clamp(4rem,10vh,7rem)]">
            <PostList posts={rest} startIndex={2} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Writing;
