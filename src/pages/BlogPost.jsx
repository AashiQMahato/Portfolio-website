import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, ChevronRight, BookOpen, Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

[
  ['jsx', jsxLang],
  ['javascript', jsLang],
  ['typescript', tsLang],
  ['python', pyLang],
  ['bash', bashLang],
  ['json', jsonLang],
  ['css', cssLang],
  ['c', cLang],
].forEach(([name, lang]) => SyntaxHighlighter.registerLanguage(name, lang));
import { blogPosts } from '../data/blogPosts';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/* ── Scroll Progress Bar ── */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-0.5 bg-border">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary/60"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0 }}
      />
    </div>
  );
};

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
      onClick={copy}
      className="absolute top-3 right-3 p-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span className="text-[10px] font-mono">copy</span>}
    </button>
  );
};

/* ── Markdown Components ── */
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold font-display mt-10 mb-5">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold font-display mt-8 mb-4 pb-2 border-b border-border">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-[1.85] text-foreground/85">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-primary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-primary">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-foreground/85">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 pl-5 border-l-4 border-primary/50 bg-primary/5 py-3 pr-4 rounded-r-xl italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/40">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold border-b border-border text-sm">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border-b border-border/50 text-muted-foreground">{children}</td>
  ),
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1] || '';
    const codeStr = String(children).replace(/\n$/, '');
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/60 font-mono text-[13px] text-primary/90">
          {children}
        </code>
      );
    }
    return (
      <div className="relative my-6 rounded-xl overflow-hidden border border-border">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            {language || 'code'}
          </span>
          <CopyButton code={codeStr} />
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{ margin: 0, background: 'transparent', fontSize: '13px', lineHeight: 1.65 }}
          {...props}
        >
          {codeStr}
        </SyntaxHighlighter>
      </div>
    );
  },
};

const CATEGORY_COLORS = {
  IoT: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  React: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  AI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};
const getCatClass = (c) => CATEGORY_COLORS[c] || 'bg-primary/10 text-primary border-primary/20';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => blogPosts.find(p => p.slug === slug), [slug]);
  const postIdx = useMemo(() => blogPosts.findIndex(p => p.slug === slug), [slug]);
  const prevPost = postIdx > 0 ? blogPosts[postIdx - 1] : null;
  const nextPost = postIdx < blogPosts.length - 1 ? blogPosts[postIdx + 1] : null;
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center section-padding pt-28">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <button onClick={() => navigate('/blog')} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <div className="relative min-h-screen">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <article className="relative z-10 mx-auto max-w-3xl section-padding pt-28">
          {/* Back */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCatClass(post.category)}`}>
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-5 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground pb-6 border-b border-border">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
              <button
                onClick={share}
                className="flex items-center gap-2 ml-auto px-3 py-1.5 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Author card */}
          <div className="mt-14 p-6 rounded-2xl border border-border bg-card/40 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-xl font-bold text-primary">
              A
            </div>
            <div>
              <div className="font-semibold">Aashiq Kumar Mahato</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Electronics Engineer &amp; Full-Stack Developer. Building at the intersection of hardware and software.
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-between">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="flex items-center gap-3 group flex-1">
                <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Previous</div>
                  <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{prevPost.title}</div>
                </div>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="flex items-center justify-end gap-3 group flex-1 text-right">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Next</div>
                  <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{nextPost.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ) : <div />}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
