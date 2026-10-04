import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsxLang from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import jsLang from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import tsLang from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import pyLang from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bashLang from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import jsonLang from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import cssLang from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import cLang from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cppLang from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';

[
  ['jsx', jsxLang],
  ['javascript', jsLang],
  ['typescript', tsLang],
  ['python', pyLang],
  ['bash', bashLang],
  ['json', jsonLang],
  ['css', cssLang],
  ['c', cLang],
  ['cpp', cppLang],
].forEach(([name, lang]) => SyntaxHighlighter.registerLanguage(name, lang));
import { blogPosts } from "../data/blogPosts";
import { Reveal, SplitText } from "../motion";
import { formatDate } from "../lib/format";
import NotFound from "./NotFound";

/* ── Copy Button ── */
const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Code copied" : "Copy code"}
      className="rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/80 transition-[color,background-color,transform] duration-100 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span aria-live="polite" className="flex items-center gap-1">
        {copied ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> copied</> : "copy"}
      </span>
    </button>
  );
};

CopyButton.propTypes = { code: PropTypes.string.isRequired };

/* ── Markdown Components ── */
const mdComponents = {
  // The page owns the only h1; markdown headings step down one level.
  h1: ({ children }) => (
    <h2 className="mb-5 mt-14 text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em] text-ink">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-14 border-t border-line pt-8 text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] text-ink">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold tracking-[-0.02em] text-ink">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[1.0625rem] leading-[1.8] text-ink-dim">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-accent-ink">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-accent-ink">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-ink-dim">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l border-signal pl-6 text-lede text-ink">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors hover:text-signal">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-panel">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-line px-4 py-3 text-left text-sm font-semibold text-ink">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line px-4 py-3 text-ink-dim">{children}</td>
  ),
  // react-markdown v9 wraps fenced blocks in <pre> and no longer passes an
  // `inline` flag: the block renderer below owns its own chrome, and a
  // fence always spans multiple source lines while inline code never does.
  pre: ({ children }) => <>{children}</>,
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1] || '';
    const codeStr = String(children).replace(/\n$/, '');
    const isBlock = Boolean(match) || node?.position?.start.line !== node?.position?.end.line;
    if (!isBlock) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/60 font-mono text-[13px] text-accent-ink">
          {children}
        </code>
      );
    }
    return (
      <div className="relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#1f232b] shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
            {language || 'code'}
          </span>
          <CopyButton code={codeStr} />
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1rem 1.25rem', background: 'transparent', fontSize: '13px', lineHeight: 1.65 }}
          codeTagProps={{ style: { background: 'transparent' } }}
          {...props}
        >
          {codeStr}
        </SyntaxHighlighter>
      </div>
    );
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const postIdx = useMemo(() => blogPosts.findIndex((p) => p.slug === slug), [slug]);
  const post = blogPosts[postIdx];
  const nextPost = blogPosts[(postIdx + 1) % blogPosts.length];
  const [copied, setCopied] = useState(false);

  if (!post) return <NotFound />;

  const share = async () => {
    const data = { title: post.title, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <article className="pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,6rem))]">
      <header className="shell">
        <Link to="/blog" className="hud mb-10 inline-flex items-center gap-2 transition-colors hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All writing
        </Link>
        <Reveal variant="fade">
          <p className="hud mb-6 flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-accent-ink">{post.category}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readTime}</span>
          </p>
        </Reveal>
        <Reveal variant="lines">
          <SplitText as="h1" text={post.title} className="max-w-5xl text-display-2 text-ink" />
        </Reveal>
        <div className="mt-8 grid gap-6 border-b border-line pb-10 lg:grid-cols-12">
          <p className="text-lede text-ink-dim lg:col-span-8">{post.excerpt}</p>
          <div className="flex items-start lg:col-span-4 lg:justify-end">
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="shell grid lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[calc(var(--nav-h)+2.5rem)] pt-12">
            <p className="hud">Written by</p>
            <p className="mt-1.5 text-ink">Aashik Kumar Mahato</p>
            <p className="mt-1 text-sm text-ink-dim">Electronics Engineer &amp; Full-Stack Developer</p>
          </div>
        </aside>
        <div className="pt-6 lg:col-span-8 lg:col-start-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {nextPost && nextPost.slug !== post.slug && (
        <nav aria-label="Next article" className="shell mt-[clamp(4rem,10vh,7rem)]">
          <Link to={`/blog/${nextPost.slug}`} data-cursor="read" className="group block border-t border-line pt-8">
            <p className="hud mb-4">Next article</p>
            <p className="flex items-end justify-between gap-6">
              <span className="text-display-2 text-ink transition-transform duration-700 ease-out group-hover:translate-x-2">
                {nextPost.title}
              </span>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-signal text-primary-foreground transition-transform duration-500 ease-out group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </p>
          </Link>
        </nav>
      )}
    </article>
  );
};

export default BlogPost;
