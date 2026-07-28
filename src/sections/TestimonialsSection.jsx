import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { testimonials } from "../data/testimonials";
import {
  gsap,
  animate,
  stagger,
  ANIME,
  Reveal,
  usePrefersReducedMotion,
} from "../motion";
import { FrameLabel, SelectionBox, CountUp } from "../components/canvas";

// Deterministic pseudo-likes so the joke chips are stable across renders.
const likesFor = (i) => ((i * 17 + 23) % 34) + 8;
const ROTATIONS = [-2.5, 1.5, -1, 2.5, -1.5];
const SIZES = ["412 × 232", "412 × 224", "412 × 228", "412 × 236", "412 × 240"];

const ReviewCard = ({ testimonial, index }) => (
  <SelectionBox
    name={`review-${String(index + 1).padStart(2, "0")}`}
    size={SIZES[index % SIZES.length]}
    tone={index % 2 ? "ember" : "accent"}
    className="panel rounded-2xl border-solid"
  >
    <figure
      data-review-card
      className="p-6"
      style={{ transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)` }}
    >
      <blockquote className="text-sm leading-relaxed text-ink">
        “{testimonial.content}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ember font-mono text-[10px] tracking-widest text-white"
          aria-hidden="true"
        >
          {testimonial.avatar}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-ink">
            {testimonial.name}
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
            {testimonial.role}
          </span>
        </span>
        <span
          className="pill ml-auto flex shrink-0 items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] text-ink-dim"
          aria-hidden="true"
        >
          <span className="text-signal">♥</span>
          <CountUp value={likesFor(index)} duration={900} />
        </span>
      </figcaption>
    </figure>
  </SelectionBox>
);

ReviewCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Testimonials as review frames scattered on the canvas — each with px
 * dimensions and a like count. Cards "deal in" with a rotation stagger the
 * first time the grid enters (ScrollTrigger detects, anime performs).
 */
const TestimonialsSection = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const cards = ref.current.querySelectorAll("[data-review-frame]");
      gsap.set(cards, { autoAlpha: 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: "[data-review-grid]",
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.set(cards, { autoAlpha: 1 });
            animate(cards, {
              opacity: [0, 1],
              translateY: [42, 0],
              rotate: [(el, i) => (i % 2 ? 7 : -7), 0],
              duration: ANIME.dur.md,
              ease: ANIME.ease.pop,
              delay: stagger(ANIME.stagger.base),
            });
          },
        },
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="testimonials"
      data-section
      aria-labelledby="testimonials-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <FrameLabel index="05" name="reviews.frame" />
          <h2
            id="testimonials-heading"
            className="mt-8 font-display text-display-2 text-ink"
          >
            Loved by collaborators
            <span className="text-signal">.</span>
          </h2>
        </Reveal>

        <div
          data-review-grid
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-review-frame
              className={i % 3 === 1 ? "lg:mt-10" : i % 3 === 2 ? "lg:-mt-4" : ""}
            >
              <ReviewCard testimonial={t} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
