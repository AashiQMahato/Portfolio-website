import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  EASE,
  ImageReveal,
  Reveal,
  useLenis,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../motion";
import { SectionHeader } from "../../components/ui";
import { projects } from "../../data/portfolioData";
import WorkSlide from "./WorkSlide";

const ORDER = [
  "studio-tools",
  "automated-attendance-system",
  "cable-network-website",
  "smart-school-management",
  "ultrasonic-blind-stick",
];
const SHOWCASE = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
/** Each project's label as a 0–1 progress value of the stage timeline. */
const labelStops = (tl) =>
  Object.values(tl.labels)
    .map((t) => t / tl.duration())
    .sort((a, b) => a - b);

const MOBILE_REVEALS = ["clip", "side", "iris", "scale", "clip"];

/**
 * Selected work. Desktop: the stage pins and scroll drives a single scrubbed
 * timeline — each next image wipes up over the last (clip-path + settling
 * scale) while the copy hands over, snapping to each project. Below lg or
 * under reduced motion the same DOM becomes an editorial vertical list with
 * varied image reveals. Inactive slides drop pointer events; keyboard focus
 * on a hidden slide scrolls the stage to it.
 */
const SelectedWork = () => {
  const ref = useRef(null);
  const stRef = useRef(null);
  const tlRef = useRef(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const pinned = wide && !reduced;
  const n = SHOWCASE.length;

  useGSAP(
    () => {
      if (!pinned) return;
      const q = gsap.utils.selector(ref);
      const slides = q("[data-slide]");
      const rail = q("[data-rail-index]");

      slides.forEach((slide, i) => {
        const frame = slide.querySelector("[data-media-frame]");
        const img = slide.querySelector("[data-media-frame] img");
        const copy = slide.querySelectorAll("[data-copy]");
        if (i === 0) return;
        gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(img, { scale: 1.25 });
        gsap.set(copy, { opacity: 0, y: 60 });
        gsap.set(slide, { pointerEvents: "none" });
      });

      let current = 0;
      const setActive = (idx) => {
        if (idx === current) return;
        current = idx;
        slides.forEach((s, i) => gsap.set(s, { pointerEvents: i === idx ? "auto" : "none" }));
        rail.forEach((r, i) => r.classList.toggle("text-ink", i === idx));
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q("[data-stage]")[0],
          start: "top top",
          end: () => `+=${(n - 1) * window.innerHeight * 1.15}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // One gesture = one project: snap to the next label in the scroll
          // direction, without velocity projection (inertia would fling a
          // fast trackpad swipe past several projects at once).
          snap: {
            snapTo: (value, self) => {
              // Already on a project (keyboard focus, programmatic scroll):
              // stay. Otherwise go to the next project in scroll direction.
              const stops = labelStops(self.animation);
              const near = stops.find((p) => Math.abs(p - value) < 0.02);
              if (near !== undefined) return near;
              return self.direction > 0
                ? stops.find((p) => p > value) ?? 1
                : [...stops].reverse().find((p) => p < value) ?? 0;
            },
            inertia: false,
            duration: { min: 0.3, max: 0.8 },
            ease: "power3.inOut",
            delay: 0.08,
          },
          onUpdate: (self) => {
            const stops = labelStops(self.animation);
            const nearest = stops.reduce((best, p, k) => (Math.abs(p - self.progress) < Math.abs(stops[best] - self.progress) ? k : best), 0);
            setActive(nearest);
            gsap.set(q("[data-rail-fill]"), { scaleY: self.progress });
          },
        },
      });
      stRef.current = tl.scrollTrigger;
      tlRef.current = tl;

      tl.addLabel("p0");
      for (let i = 1; i < n; i += 1) {
        const prev = slides[i - 1];
        const next = slides[i];
        const at = i - 1;
        tl.to(prev.querySelectorAll("[data-copy]"), { opacity: 0, y: -48, stagger: 0.04, duration: 0.45, ease: EASE.soft }, at)
          .to(prev.querySelector("[data-media-frame] img"), { scale: 1.08, duration: 1 }, at)
          .to(next.querySelector("[data-media-frame]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, at)
          .to(next.querySelector("[data-media-frame] img"), { scale: 1, duration: 1, ease: "power2.out" }, at)
          .to(next.querySelectorAll("[data-copy]"), { opacity: 1, y: 0, stagger: 0.05, duration: 0.55, ease: EASE.out }, at + 0.4)
          .addLabel(`p${i}`, at + 1);
      }
      return () => {
        stRef.current = null;
      };
    },
    { dependencies: [pinned], scope: ref, revertOnUpdate: true },
  );

  /** Keyboard users tabbing into a hidden slide are scrolled to it. */
  const onSlideFocus = (i) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * labelStops(tlRef.current)[i];
    if (lenis) lenis.scrollTo(y, { duration: 0.8 });
    else window.scrollTo({ top: y });
  };

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="relative pt-[clamp(6rem,14vh,11rem)]">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Selected work"
          id="work-title"
          title={["Proof,", "not promises."]}
          aside={
            <p className="max-w-sm text-ink-dim">
              Five builds across AI tooling, computer vision, product web, school
              operations and assistive hardware — each with a written case study.
            </p>
          }
        />
      </div>

      <div
        data-stage
        className={pinned ? "relative h-[100svh] overflow-clip" : "shell space-y-[clamp(5rem,14vh,9rem)]"}
      >
        {SHOWCASE.map((project, i) => (
          <WorkSlide
            key={project.slug}
            project={project}
            index={i}
            total={n}
            pinned={pinned}
            onFocus={() => onSlideFocus(i)}
            media={
              pinned ? null : (
                <ImageReveal
                  src={project.image}
                  alt=""
                  width={1600}
                  height={974}
                  variant={MOBILE_REVEALS[i % MOBILE_REVEALS.length]}
                  className="aspect-[16/10] rounded-lg bg-panel"
                />
              )
            }
          />
        ))}

        {pinned && (
          <div aria-hidden="true" className="absolute right-[var(--gutter)] top-1/2 flex -translate-y-1/2 items-stretch gap-4">
            <div className="relative w-px bg-line">
              <div data-rail-fill className="absolute inset-0 origin-top scale-y-0 bg-signal" />
            </div>
            <ol className="flex flex-col justify-between gap-6 py-1">
              {SHOWCASE.map((p, i) => (
                <li key={p.slug} data-rail-index className={`hud tabular-nums transition-colors duration-300 ${i === 0 ? "text-ink" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="shell">
        <Reveal variant="clip" className="mt-[clamp(4rem,10vh,7rem)] border-t border-line">
          <Link
            to="/projects"
            className="group flex items-center justify-between gap-6 py-8 text-ink"
          >
            <span className="flex items-baseline gap-4">
              <span className="hud tabular-nums">({String(projects.length).padStart(2, "0")})</span>
              <span className="text-[clamp(1.75rem,4vw,3.25rem)] font-medium tracking-[-0.035em] transition-transform duration-500 ease-out group-hover:translate-x-2">
                Full project index
              </span>
            </span>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-primary-foreground">
              <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default SelectedWork;
