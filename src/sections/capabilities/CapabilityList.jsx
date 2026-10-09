import { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { BrainCircuit, Cpu, Globe, RadioTower, Server, Wrench } from "lucide-react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import { useTheme } from "../../context/ThemeContext";
import { techColor } from "./techColor";
import { capabilityShape } from "./shapes";

const MARKERS = { web: Globe, backend: Server, ai: BrainCircuit, embedded: Cpu, iot: RadioTower, tools: Wrench };

/**
 * Capability index as a tablist. Wide screens: a vertical index whose signal
 * bar travels to the active row, which opens to show its summary and the
 * brand colours of what's inside. Narrow screens: a scrollable strip.
 * Arrow keys move between capabilities (automatic activation).
 */
const CapabilityList = ({ items, activeId, onSelect, onPreview, wide }) => {
  const listRef = useRef(null);
  const barRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();

  // Indicator follows the active row. quickTo re-targets on every call, so it
  // tracks the rows while the open/close height transition is still running.
  useLayoutEffect(() => {
    if (!wide || !barRef.current) return undefined;
    const bar = barRef.current;
    const dur = reduced ? 0 : 0.55;
    const toY = gsap.quickTo(bar, "y", { duration: dur, ease: EASE.expo });
    const toH = gsap.quickTo(bar, "height", { duration: dur, ease: EASE.expo });
    const follow = () => {
      const row = listRef.current?.querySelector(`[data-cap="${activeId}"]`);
      if (!row) return;
      toY(row.offsetTop);
      toH(row.offsetHeight);
    };
    follow();
    const ro = new ResizeObserver(follow);
    listRef.current.querySelectorAll("[data-cap]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [activeId, wide, reduced]);

  // Narrow strip: keep the active tab in view.
  useLayoutEffect(() => {
    if (wide) return;
    const tab = listRef.current.querySelector(`[data-cap="${activeId}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  }, [activeId, wide, reduced]);

  const onKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const edge = { Home: 0, End: items.length - 1 }[e.key];
    if (step === undefined && edge === undefined) return;
    e.preventDefault();
    const i = items.findIndex((c) => c.id === activeId);
    const next = items[edge ?? (i + step + items.length) % items.length];
    onSelect(next.id);
    listRef.current.querySelector(`[data-cap="${next.id}"]`)?.focus();
  };

  return (
    <div className="relative">
      {wide && (
        <span
          ref={barRef}
          data-cap-bar
          aria-hidden="true"
          className="absolute left-0 top-0 w-[2px] origin-top bg-signal"
          style={{ height: 0 }}
        />
      )}
      <div
        ref={listRef}
        role="tablist"
        aria-label="Capabilities"
        aria-orientation={wide ? "vertical" : "horizontal"}
        onKeyDown={onKeyDown}
        className={
          wide
            ? "flex flex-col border-l border-line"
            : "-mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-1 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
      >
        {items.map((c) => {
          const on = c.id === activeId;
          const Marker = MARKERS[c.marker] ?? Globe;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`cap-tab-${c.id}`}
              data-cap={c.id}
              data-cap-row
              aria-selected={on}
              aria-controls="capability-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(c.id)}
              onPointerEnter={() => !on && onPreview(true)}
              onPointerLeave={() => onPreview(false)}
              className={
                wide
                  ? "group relative w-full py-4 pl-6 pr-2 text-left outline-none focus-visible:bg-panel"
                  : `group relative shrink-0 snap-start border-b-2 px-3 py-3 text-left outline-none transition-colors duration-300 focus-visible:bg-panel ${
                      on ? "border-signal" : "border-line"
                    }`
              }
            >
              <span
                className={`flex items-center gap-4 transition-transform duration-500 ease-out ${wide && !on ? "group-hover:translate-x-1.5" : ""}`}
              >
                <span
                  className={`font-mono text-[0.6875rem] tabular-nums tracking-[0.1em] transition-colors duration-300 ${
                    on ? "text-signal" : "text-ink-faint group-hover:text-ink-dim"
                  }`}
                >
                  {c.index}
                </span>
                {wide && (
                  <Marker
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={`h-4 w-4 shrink-0 transition-[color,transform] duration-500 ease-out ${
                      on ? "text-ink" : "text-ink-faint group-hover:rotate-[-8deg] group-hover:text-ink-dim"
                    }`}
                  />
                )}
                <span
                  className={`whitespace-nowrap font-medium tracking-[-0.02em] transition-colors duration-300 ${
                    wide ? "text-[clamp(1.05rem,1.45vw,1.35rem)]" : "text-sm"
                  } ${on ? "text-ink" : "text-ink-dim group-hover:text-ink"}`}
                >
                  {c.label}
                </span>
              </span>

              {wide && (
                <span
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="block pl-[4.1rem] pt-2 text-sm leading-relaxed text-ink-dim">{c.summary}</span>
                    <span aria-hidden="true" className="flex gap-1.5 pl-[4.1rem] pt-3">
                      {c.techs.map((t) => (
                        <span
                          key={t.name}
                          className="h-1.5 w-4 rounded-full"
                          style={{ background: t.icon ? techColor(t.icon.hex, theme) : "rgb(var(--ink-faint))" }}
                        />
                      ))}
                    </span>
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

CapabilityList.propTypes = {
  items: PropTypes.arrayOf(capabilityShape).isRequired,
  activeId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  wide: PropTypes.bool.isRequired,
};

export default CapabilityList;
