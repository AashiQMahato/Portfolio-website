import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, useMediaQuery, usePrefersReducedMotion } from "../../motion";
import { SectionHeader } from "../../components/ui";
import SectionAvatar from "../../components/avatar/SectionAvatar";
import { BEHAVIOR, CAPABILITY_LINES, sayAvatar } from "../../components/avatar/mood";
import { capabilities } from "../../data/stack";
import CapabilityList from "./CapabilityList";
import TechDetails from "./TechDetails";
import TechGrid from "./TechGrid";

// three.js only loads for the wide, fine-pointer layout that shows it.
const TechStage = lazy(() => import("./TechStage"));

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

/**
 * Capabilities as an explorable lab: a capability index on the left, and on
 * the right the active capability's technologies as official marks orbiting
 * a silicon die (WebGL), traced below to the projects, roles and writing they
 * appear in. Touch, narrow screens and no-WebGL get a ruled logo grid with the
 * same data and controls.
 */
const Capabilities = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const webgl = useMemo(() => typeof document !== "undefined" && hasWebGL(), []);
  const [glFailed, setGlFailed] = useState(false);
  const use3D = wide && finePointer && webgl && !glFailed;

  const [activeId, setActiveId] = useState(capabilities[0].id);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [entered, setEntered] = useState(false);

  const capability = capabilities.find((c) => c.id === activeId);
  const focusName = hovered ?? pinned;
  const tech = capability.techs.find((t) => t.name === focusName) ?? null;

  const select = (id) => {
    if (id === activeId) return;
    setActiveId(id);
    sayAvatar(CAPABILITY_LINES[id], { mood: BEHAVIOR.focused, context: { capability: id } });
    setHovered(null);
    setPinned(null);
    setPreviewing(false);
  };
  const pick = (name) => setPinned((p) => (p === name ? null : name));

  // Entrance: index rows clip in, the signal bar draws, the stage frame
  // rules extend, then the scene assembles (TechStage listens to `entered`).
  useGSAP(
    () => {
      if (reduced) {
        setEntered(true);
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-cap-body]", start: "top 78%", once: true },
        onStart: () => gsap.delayedCall(0.35, () => setEntered(true)),
      });
      const has = (sel) => ref.current.querySelector(sel);
      tl.from("[data-cap-row]", {
        clipPath: "inset(0 0 100% 0)",
        y: 18,
        duration: 0.7,
        ease: EASE.strong,
        stagger: 0.06,
        clearProps: "clipPath,transform",
      });
      if (has("[data-cap-bar]")) tl.from("[data-cap-bar]", { scaleY: 0, duration: 0.8, ease: EASE.expo }, 0.25);
      if (has("[data-stage-rule]")) {
        tl.from("[data-stage-rule]", { scaleX: 0, duration: 1, ease: EASE.inOut, stagger: 0.08 }, 0.1).from(
          "[data-stage-meta]",
          { opacity: 0, y: 6, duration: 0.5, ease: EASE.out, stagger: 0.06 },
          0.5,
        );
      }
      tl.from("#capability-detail", { opacity: 0, y: 16, duration: 0.7, ease: EASE.out }, 0.6);
    },
    { dependencies: [reduced, wide], scope: ref },
  );

  return (
    <section ref={ref} id="skills" aria-labelledby="skills-title" className="relative py-[clamp(7rem,16vh,13rem)]">
      <div className="shell">
        <SectionHeader
          index="05"
          avatar={{ mood: "working", hover: "excited" }}
          label="Capabilities"
          id="skills-title"
          title={["Beyond the browser.", "Into the real world."]}
          aside={
            <p className="max-w-sm text-ink-dim">
              I combine software engineering, interface development and electronics to build useful digital
              experiences and intelligent systems.
            </p>
          }
        />

        <div data-cap-body className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-4">
            <CapabilityList
              items={capabilities}
              activeId={activeId}
              onSelect={select}
              onPreview={setPreviewing}
              wide={wide}
            />
          </div>

          <div
            id="capability-panel"
            role="tabpanel"
            aria-labelledby={`cap-tab-${activeId}`}
            className="min-w-0 lg:col-span-8"
          >
            {use3D ? (
              <div className="micro-grid relative h-[clamp(30rem,64vh,40rem)] overflow-hidden rounded-xl">
                {/* Frame: hairline rules and two quiet captions. */}
                <span data-stage-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
                <span data-stage-rule aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-right bg-line" />
                <p data-stage-meta className="hud pointer-events-none absolute left-5 top-4 z-10">
                  <span className="text-ink">Fig. 05.{capability.index}</span> — Software → silicon
                </p>
                <span className="absolute right-4 top-3 z-10">
                  <SectionAvatar mood={BEHAVIOR.focused} hover="excited" className="h-12 w-12" />
                </span>
                <p data-stage-meta className="hud pointer-events-none absolute bottom-4 right-5 z-10 tabular-nums">
                  {capability.techs.length} marks · {capability.label}
                </p>
                <Suspense fallback={null}>
                  <TechStage
                    capability={capability}
                    entered={entered}
                    active={focusName}
                    pinned={pinned}
                    previewing={previewing}
                    onHover={setHovered}
                    onPick={pick}
                    onFail={() => setGlFailed(true)}
                  />
                </Suspense>
              </div>
            ) : (
              <TechGrid capability={capability} pinned={pinned} onPick={pick} />
            )}

            <div className="mt-8">
              <TechDetails capability={capability} tech={tech} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
