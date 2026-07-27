import { lazy, Suspense } from "react";
import Hero from "../sections/Hero";
import About from "../sections/About";
import TechTicker from "../sections/TechTicker";
import ProcessChat from "../sections/ProcessChat";
import SkillsCanvas from "../sections/SkillsCanvas";
import FeaturedProjects from "../sections/FeaturedProjects";
import TestimonialsSection from "../sections/TestimonialsSection";
import Contact from "../sections/Contact";
import SchematicRail from "../components/schematic/SchematicRail";
import { HOME_SECTIONS } from "../components/schematic/Nav";
import { useWebGLSupport } from "../scene";
import { useMediaQuery, usePrefersReducedMotion } from "../motion";

// Lazy so three.js (and the anime three adapter) live in their own async
// chunk and never block first paint.
const SkyScene = lazy(() => import("../scene/SkyScene"));

/** The scroll-driven one-pager: hero → about → skills → work → voices → contact. */
const Home = () => {
  const reduced = usePrefersReducedMotion();
  const isWide = useMediaQuery("(min-width: 768px)");
  const webglOk = useWebGLSupport();
  const showSky =
    !reduced && isWide && webglOk && !navigator?.connection?.saveData;

  return (
    <div className="relative text-ink">
      {/* WebGL sky above the CssSky fallback (which RouterLayout mounts
          globally) — same palette, so the handoff is seamless. */}
      {showSky && (
        <Suspense fallback={null}>
          <SkyScene />
        </Suspense>
      )}

      <div className="relative z-10">
        <SchematicRail sections={HOME_SECTIONS} />
        <Hero />
        <About />
        <TechTicker />
        <ProcessChat />
        <SkillsCanvas />
        <FeaturedProjects />
        <TestimonialsSection />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
