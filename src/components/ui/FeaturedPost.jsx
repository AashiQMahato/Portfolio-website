import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../../motion";
import { formatDate } from "../../lib/format";
import PostCover from "./PostCover";

/** Lead article: large generated cover beside the headline and excerpt. */
const FeaturedPost = ({ post, headingLevel = "h3" }) => {
  const Heading = headingLevel;
  return (
    <article className="group grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal variant="clip" className="lg:col-span-7">
        <Link to={`/blog/${post.slug}`} data-cursor="read" aria-hidden="true" tabIndex={-1} className="block overflow-hidden rounded-lg">
          <PostCover
            slug={post.slug}
            category={post.category}
            index={1}
            className="aspect-[16/10] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
          />
        </Link>
      </Reveal>
      <Reveal variant="rise" selector="[data-feat]" className="lg:col-span-5">
        <p data-feat className="hud mb-5 flex flex-wrap gap-x-3">
          <span className="text-accent-ink">Featured</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime}</span>
        </p>
        <Heading data-feat className="text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
          <Link to={`/blog/${post.slug}`} className="transition-colors duration-300 hover:text-signal">
            {post.title}
          </Link>
        </Heading>
        <p data-feat className="mt-5 text-ink-dim">{post.excerpt}</p>
        <p data-feat className="mt-7">
          <Link to={`/blog/${post.slug}`} className="group/cta inline-flex items-center gap-2 text-sm font-medium text-ink">
            <span className="link-line">Read article</span>
            <span className="sr-only">: {post.title}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover/cta:translate-x-1" aria-hidden="true" />
          </Link>
        </p>
      </Reveal>
    </article>
  );
};

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    readTime: PropTypes.string,
  }).isRequired,
  headingLevel: PropTypes.oneOf(["h2", "h3"]),
};

export default FeaturedPost;
