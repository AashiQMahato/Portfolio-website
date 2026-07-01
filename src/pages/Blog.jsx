import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { ScrollReveal } from '../components/ui';
import { blogPosts } from '../data/blogPosts';

const CATEGORY_COLORS = {
  IoT: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  React: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  AI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Architecture: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Performance: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const getCategoryClass = (cat) =>
  CATEGORY_COLORS[cat] || 'bg-primary/10 text-primary border-primary/20';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogCard = ({ post, index, featured }) => (
  <ScrollReveal delay={index * 0.08}>
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`h-full flex flex-col p-6 rounded-2xl border border-border bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${featured ? 'md:p-8' : ''}`}
      >
        {/* Category */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* Title */}
        <h2 className={`font-bold font-display text-foreground group-hover:text-primary transition-colors mb-3 leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-5">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>
      </motion.article>
    </Link>
  </ScrollReveal>
);

const Blog = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="relative min-h-screen">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 section-padding pt-28 mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-medium border rounded-full border-border bg-card/60 backdrop-blur text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            Technical Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Blog &amp; <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Engineering articles, tutorials, and technical deep dives from my journey building across web, hardware, and AI.
          </p>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary/30 shadow-sm'
                    : 'border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No posts in this category yet.</div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <div className="mb-8">
                <BlogCard post={featured} index={0} featured />
              </div>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i + 1} />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <div className="mt-20 py-12 text-center rounded-2xl border border-border bg-card/30">
            <BookOpen className="w-10 h-10 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold font-display mb-2">More articles coming soon</h3>
            <p className="text-muted-foreground text-sm">
              Follow my GitHub for project updates and engineering notes.
            </p>
            <a
              href="https://github.com/Aashik9567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Follow on GitHub <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Blog;
