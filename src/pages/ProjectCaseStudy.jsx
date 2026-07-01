import React, { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  CheckCircle2,
  Target,
  Lightbulb,
  Rocket,
  ChevronRight,
  LayoutTemplate,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import { projects } from "../data/portfolioData";
import { ScrollReveal } from "../components/ui";
import { useRecruiterMode } from "../context/RecruiterModeContext";

const normalizeGalleryItem = (item) => {
  if (!item) return null;
  if (typeof item === "string") return { src: item };
  const src = item.src || item.url;
  if (!src) return null;
  return { src, caption: item.caption, label: item.label };
};

const getFeaturedMedia = (project) => {
  if (!project) return { type: "none" };
  if (project.featuredVideo)
    return { type: "video", src: project.featuredVideo };
  if (project.image) return { type: "image", src: project.image };
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const first = normalizeGalleryItem(gallery[0]);
  if (first?.src) return { type: "image", src: first.src };
  return { type: "none" };
};

const ArchitectureFlow = ({ items }) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  const flow = items.slice(0, 5);
  return (
    <div className="p-5 md:p-6 rounded-2xl bg-card/40 border border-border">
      <div className="flex flex-wrap items-center gap-2">
        {flow.map((node, idx) => (
          <React.Fragment key={`${node.component}-${idx}`}>
            <div className="px-3 py-2 rounded-xl border border-border bg-background/40">
              <div className="text-xs font-semibold text-foreground">
                {node.component}
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">
                {node.desc}
              </div>
            </div>
            {idx < flow.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground/60" />
            )}
          </React.Fragment>
        ))}
      </div>
      {items.length > flow.length && (
        <div className="mt-3 text-xs text-muted-foreground">
          +{items.length - flow.length} more components
        </div>
      )}
    </div>
  );
};

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isRecruiterMode } = useRecruiterMode();

  const project = useMemo(() => projects.find((p) => p.slug === slug), [slug]);
  const projectIndex = useMemo(
    () => projects.findIndex((p) => p.slug === slug),
    [slug],
  );

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center section-padding pt-28">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The case study you are looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          Back to Projects
        </button>
      </div>
    );
  }

  const featured = getFeaturedMedia(project);
  const galleryItems = (Array.isArray(project.gallery) ? project.gallery : [])
    .map(normalizeGalleryItem)
    .filter(Boolean);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Decorative Blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl section-padding pt-28">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to all projects
        </Link>

        {/* 1. Hero Section */}
        <ScrollReveal>
          <header className="mb-16 lg:mb-24">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium border rounded-full border-border bg-card/60 text-muted-foreground">
                  {tag}
                </span>
              ))}
              {project.status === "live" && (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{" "}
                  Live
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-10">
              {project.tagline || project.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <ExternalLink className="w-4 h-4" /> View Live Project
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 bg-card/80 border border-border text-foreground hover:bg-card hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <Github className="w-4 h-4" /> Source Code
                </a>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* Recruiter summary */}
        {isRecruiterMode && (
          <ScrollReveal delay={0.05}>
            <section className="mb-14 rounded-2xl border border-border bg-card/40 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recruiter Summary
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {project.recruiterSummary ||
                      "A focused breakdown of scope, decisions, and measurable outcomes."}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/resume"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-card/70 border border-border hover:bg-card transition-colors">
                    View Resume
                  </Link>
                  <Link
                    to="/contactus"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    Contact
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* At a glance */}
        <ScrollReveal delay={0.08}>
          <section className="mb-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-border bg-card/40">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Role
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {project.role || "Full-stack engineer"}
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card/40">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Scope
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {project.scope || `${project.category} · ${project.year}`}
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card/40">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Team
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {project.teamSize ? `Team of ${project.teamSize}` : "Solo"}
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card/40">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Timeline
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {project.timeline || "Shipped iteratively"}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Featured Media */}
        {featured.type !== "none" && (
          <ScrollReveal delay={0.2}>
            <div className="mb-20 lg:mb-32 rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-card/40 shadow-2xl relative group">
              {/* Browser mockup header */}
              <div className="h-10 md:h-12 bg-card border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto px-4 py-1.5 rounded-md bg-background/50 border border-border text-xs text-muted-foreground font-mono truncate max-w-[200px] md:max-w-sm">
                  {project.live || "localhost:3000"}
                </div>
              </div>
              <div className="relative aspect-video">
                {featured.type === "video" ? (
                  <video
                    src={featured.src}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={featured.src}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 2. Problem Statement */}
        <ScrollReveal>
          <section className="mb-20 lg:mb-32 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold font-display">The Challenge</h2>
            </div>

            <div className="pl-6 border-l-4 border-primary/40">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.problemStatement || project.fullDesc}
              </p>
            </div>

            {(project.audience || project.whyItMatters) && (
              <div className="mt-10 grid md:grid-cols-2 gap-4">
                {project.audience && (
                  <div className="p-6 rounded-2xl bg-card/40 border border-border">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Target Audience
                    </div>
                    <div className="mt-2 text-sm text-foreground/90 leading-relaxed">
                      {Array.isArray(project.audience)
                        ? project.audience.join(", ")
                        : project.audience}
                    </div>
                  </div>
                )}
                {project.whyItMatters && (
                  <div className="p-6 rounded-2xl bg-card/40 border border-border">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Why It Matters
                    </div>
                    <ul className="mt-3 space-y-2">
                      {(Array.isArray(project.whyItMatters)
                        ? project.whyItMatters
                        : [project.whyItMatters]
                      ).map((v, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* 3. Architecture */}
        {project.architecture && (
          <ScrollReveal>
            <section className="mb-20 lg:mb-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10">
                  <LayoutTemplate className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-display">
                  Architecture & System Design
                </h2>
              </div>

              <ArchitectureFlow items={project.architecture} />

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {project.architecture.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-card/40 border border-border hover:border-primary/30 transition-colors">
                    <h3 className="text-lg font-bold mb-3">{item.component}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 4. Challenges & Solutions */}
        {project.challenges && (
          <ScrollReveal>
            <section className="mb-20 lg:mb-32 max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-display">
                  Technical Hurdles
                </h2>
              </div>

              <div className="space-y-6">
                {project.challenges.map((c, i) => (
                  <div
                    key={i}
                    className="p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-primary">0{i + 1}.</span> {c.title}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Problem
                        </span>
                        <p className="mt-1 text-foreground/90">{c.problem}</p>
                      </div>
                      <div className="pl-4 border-l-2 border-primary/30">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Solution
                        </span>
                        <p className="mt-1 text-muted-foreground">
                          {c.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 4.5 Metrics / Impact */}
        {project.metrics && (
          <ScrollReveal>
            <section className="mb-20 lg:mb-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-display">
                  Measurable Impact
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-card/40 border border-border">
                    <div className="text-3xl font-bold font-display text-primary mb-2">
                      {metric.value || metric.improvement}
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {metric.label}
                    </div>
                    {(metric.before || metric.after) && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between border-t border-border/50 pt-2">
                        <span>Before: {metric.before}</span>
                        <ArrowRight className="w-3 h-3 mx-1 text-primary/50" />
                        <span>After: {metric.after}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 4.75 Gallery */}
        {galleryItems.length > 0 && (
          <ScrollReveal>
            <section className="mb-20 lg:mb-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-display">
                  Project Gallery
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {galleryItems.map((item, i) => (
                  <a
                    key={item.src + i}
                    href={item.src}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-video rounded-2xl overflow-hidden border border-border bg-card/40 shadow-sm hover:shadow-xl transition-all"
                    aria-label={`Open ${project.title} media ${i + 1}`}>
                    <img
                      src={item.src}
                      alt={
                        item.caption || `${project.title} screenshot ${i + 1}`
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {(item.label || item.caption) && (
                      <div className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-3 py-2 rounded-xl bg-background/70 backdrop-blur border border-border text-xs text-foreground">
                          {item.label && (
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                              {item.label}
                            </div>
                          )}
                          {item.caption && (
                            <div className="mt-0.5">{item.caption}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 5. Lessons Learned */}
        {project.lessons && (
          <ScrollReveal>
            <section className="mb-20 lg:mb-32 max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-display">
                  Key Takeaways
                </h2>
              </div>

              <ul className="space-y-4">
                {project.lessons.map((lesson, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/40 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">
                      {lesson}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        )}

        {/* 5.5 Future Improvements */}
        {Array.isArray(project.futureImprovements) &&
          project.futureImprovements.length > 0 && (
            <ScrollReveal>
              <section className="mb-20 lg:mb-32 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold font-display">
                    Next Iteration
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.futureImprovements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-border bg-card/40 text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

        {/* 6. Bottom Navigation */}
        <div className="pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="flex items-center gap-3 group text-left max-w-[45%]">
              <div className="w-10 h-10 rounded-full border border-border bg-card/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Previous
                </div>
                <div className="font-semibold truncate">
                  {prevProject.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="flex items-center justify-end gap-3 group text-right max-w-[45%]">
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Next
                </div>
                <div className="font-semibold truncate">
                  {nextProject.title}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-border bg-card/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCaseStudy;
