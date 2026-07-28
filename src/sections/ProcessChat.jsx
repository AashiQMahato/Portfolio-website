import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  animate,
  ANIME,
  Reveal,
  usePrefersReducedMotion,
} from "../motion";
import { FrameLabel } from "../components/canvas";

const THREAD = [
  { step: "01 · Say hello" },
  { from: "you", time: "10:02", text: "hey — saw the work. got a project brewing 🚀" },
  { from: "me", time: "10:03", text: "you're in the right channel 👋 what's the vision?" },
  { step: "02 · Send the brief" },
  { from: "you", time: "10:31", text: "brief's in. probably overkill on detail", file: "project-brief.pdf" },
  { from: "me", time: "10:32", text: "never too much. first prototype in days, not weeks" },
  { step: "03 · Refine" },
  { from: "me", time: "Day 2", text: "here's take one 👀", file: "prototype-v1.fig" },
  { from: "you", time: "Day 2", text: "did you read my mind? bolder hero though", reaction: "🔥 2" },
  { from: "me", time: "Day 2", text: "on it. change anything, as often as you want" },
  { step: "04 · Ship it" },
  { from: "me", time: "Day 3", text: "shipped ✨ hardware humming, UI singing. go turn heads" },
];

const Bubble = ({ msg }) => {
  const mine = msg.from === "me";
  return (
    <div
      data-chat-msg
      className={`flex w-full ${mine ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[85%] sm:max-w-[70%] ${mine ? "" : "text-right"}`}>
        <p
          className={`mb-1 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim ${
            mine ? "" : "justify-end"
          }`}
        >
          <span className={mine ? "text-accent-ink" : "text-ember"}>
            {mine ? "aashiq" : "you"}
          </span>
          {msg.time}
        </p>
        <div
          className={`inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed ${
            mine
              ? "rounded-tl-md border border-line bg-panel text-ink"
              : "rounded-tr-md bg-ember text-white"
          }`}
        >
          {msg.text}
          {msg.file && (
            <span
              className={`mt-2 flex w-fit items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] ${
                mine
                  ? "border-line bg-background/60 text-accent-ink"
                  : "border-white/40 bg-white/10 text-white"
              }`}
            >
              <span aria-hidden="true">📎</span>
              {msg.file}
            </span>
          )}
        </div>
        {msg.reaction && (
          <p className="mt-1.5">
            <span className="pill inline-block px-2 py-0.5 font-mono text-[10px] text-ink-dim">
              {msg.reaction}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

Bubble.propTypes = {
  msg: PropTypes.shape({
    from: PropTypes.string,
    time: PropTypes.string,
    text: PropTypes.string,
    file: PropTypes.string,
    reaction: PropTypes.string,
  }).isRequired,
};

/**
 * The working process told as a #project-channel chat thread. Each message
 * pops in as it scrolls into view — ScrollTrigger detects (once), anime.js
 * performs, per the division-of-labor rules.
 */
const ProcessChat = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray("[data-chat-msg], [data-chat-step]").forEach((el) => {
        gsap.set(el, { autoAlpha: 0 });
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.set(el, { autoAlpha: 1 });
              animate(el, {
                opacity: [0, 1],
                translateY: [18, 0],
                scale: [0.96, 1],
                duration: ANIME.dur.sm,
                ease: ANIME.ease.pop,
              });
            },
          },
        });
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="process"
      data-section
      aria-labelledby="process-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <FrameLabel index="02" name="process.frame" />
          <h2
            id="process-heading"
            className="mt-8 font-display text-display-2 text-ink"
          >
            No forms. No hoops
            <span className="text-signal">.</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-dim">
            One thread, zero chaos. Here&apos;s how a project goes.
          </p>
        </Reveal>

        <div className="panel mt-12 overflow-hidden rounded-3xl">
          {/* Channel header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
            <span className="font-mono text-sm font-bold text-ink">
              <span className="text-accent-ink">#</span>project-channel
            </span>
            <span className="font-mono text-[11px] text-ink-dim">
              aashiq × your-team
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              2 online
            </span>
          </div>

          {/* Thread */}
          <div className="flex flex-col gap-5 px-5 py-8 sm:px-8">
            {THREAD.map((item, i) =>
              item.step ? (
                <p
                  key={i}
                  data-chat-step
                  className="my-2 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim"
                >
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                  {item.step}
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </p>
              ) : (
                <Bubble key={i} msg={item} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessChat;
