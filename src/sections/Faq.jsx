import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "../data/faq";
import { Reveal } from "../motion";
import { FrameLabel } from "../components/canvas";

/**
 * The nosy section — five .FRAME files you'd otherwise ask on a call.
 * Native disclosure semantics (button + region) with a CSS grid-rows
 * height transition; Reveal staggers the rows in.
 */
const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      data-section
      aria-labelledby="faq-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <FrameLabel index="06" name="faq.frame" />
          <h2 id="faq-heading" className="mt-8 font-display text-display-2 text-ink">
            The nosy section
            <span className="text-signal">.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            Everything you&apos;d grill me on a call, minus the call.
          </p>
        </Reveal>

        <Reveal selector="[data-faq-row]" className="mt-12 space-y-4">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.file}
                data-faq-row
                data-poi="faq"
                className={`panel rounded-2xl transition-colors ${
                  isOpen ? "border-signal/60" : ""
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 md:px-6"
                  >
                    <span className="font-mono text-[10px] tracking-[0.15em] text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                        {item.file}
                      </span>
                      <span className="mt-1 block font-display text-base font-bold text-ink md:text-lg">
                        {item.q}
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-ink-dim transition-transform ${
                        isOpen ? "rotate-180" : ""
                      } motion-reduce:transition-none`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-label={item.q}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-ink-dim md:px-6 md:pl-[3.5rem]">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
                        Answer
                      </span>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default Faq;
