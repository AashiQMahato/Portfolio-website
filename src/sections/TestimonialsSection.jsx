import PropTypes from "prop-types";
import { testimonials } from "../data/testimonials";
import SectionHeading from "../components/schematic/SectionHeading";
import Marquee from "../components/ui/Marquee";

const TestimonialCard = ({ testimonial }) => (
  <figure className="w-[320px] shrink-0 border border-line bg-panel/60 p-6 sm:w-[360px]">
    <span className="font-mono text-signal" aria-hidden="true">
      &gt;_
    </span>
    <blockquote className="mt-3 text-sm leading-relaxed text-ink-dim">
      “{testimonial.content}”
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center border border-line font-mono text-[10px] tracking-widest text-signal"
        aria-hidden="true"
      >
        {testimonial.avatar}
      </span>
      <span>
        <span className="block text-sm font-medium text-ink">{testimonial.name}</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
          {testimonial.role}
        </span>
      </span>
    </figcaption>
  </figure>
);

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

const TestimonialsSection = () => (
  <section
    id="testimonials"
    data-section
    aria-labelledby="testimonials-heading"
    className="relative py-[clamp(6rem,14vh,11rem)]"
  >
    <div className="mx-auto max-w-6xl px-5 md:px-10 lg:pl-28 lg:pr-16">
      <SectionHeading
        index="04"
        label="Voices"
        title={<span id="testimonials-heading">Readings from the field<span className="text-signal">.</span></span>}
      />
    </div>

    <Marquee speed={45} className="mb-5">
      {testimonials.map((t) => (
        <TestimonialCard key={t.name} testimonial={t} />
      ))}
    </Marquee>
    {/* Second row repeats the same quotes — decorative for screen readers */}
    <div aria-hidden="true">
      <Marquee speed={52} direction="right">
        {[...testimonials].reverse().map((t) => (
          <TestimonialCard key={`${t.name}-rev`} testimonial={t} />
        ))}
      </Marquee>
    </div>
  </section>
);

export default TestimonialsSection;
