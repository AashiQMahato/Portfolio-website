import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../../motion";
import { formatMonth } from "../../lib/format";
import FollowPreview from "./FollowPreview";
import PostCover from "./PostCover";

/**
 * Editorial post index: hairline rows (date · title · category · length).
 * On desktop, hovering a row shifts its title, reveals the arrow and brings
 * the post's cover along beside the cursor; on touch it's a plain list.
 */
const PostList = ({ posts, startIndex = 1, headingLevel = "h3" }) => {
  const [active, setActive] = useState(null);
  const Heading = headingLevel;

  return (
    <>
      <Reveal as="ul" variant="clip" selector="[data-post-row]" className="border-t border-line" onMouseLeave={() => setActive(null)}>
        {posts.map((post) => (
          <li key={post.slug} data-post-row className="border-b border-line">
            <Link
              to={`/blog/${post.slug}`}
              data-cursor="read"
              onMouseEnter={() => setActive(post.slug)}
              onFocus={() => setActive(post.slug)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 md:grid-cols-[8rem_1fr_9rem_7rem_2.5rem]"
            >
              <time dateTime={post.date} className="hud order-2 md:order-none">
                {formatMonth(post.date)}
              </time>
              <Heading className="col-span-2 text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 md:col-span-1">
                {post.title}
              </Heading>
              <span className="hud order-3 hidden md:order-none md:block">{post.category}</span>
              <span className="hud order-4 hidden text-right md:order-none md:block">{post.readTime}</span>
              <span
                aria-hidden="true"
                className="order-5 hidden h-10 w-10 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,transform] duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-primary-foreground md:order-none md:grid"
              >
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-out group-hover:rotate-0" />
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
      <FollowPreview
        activeKey={active}
        items={posts.map((p, i) => ({
          key: p.slug,
          node: <PostCover slug={p.slug} category={p.category} index={startIndex + i} className="h-full" />,
        }))}
      />
    </>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.string,
      readTime: PropTypes.string,
    }),
  ).isRequired,
  startIndex: PropTypes.number,
  headingLevel: PropTypes.oneOf(["h2", "h3"]),
};

export default PostList;
