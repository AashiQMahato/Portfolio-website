import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import FeaturedProjects from "../sections/FeaturedProjects";
import TestimonialsSection from "../sections/TestimonialsSection";
import Contact from "../sections/Contact";
import SchematicRail from "../components/schematic/SchematicRail";
import { HOME_SECTIONS } from "../components/schematic/Nav";

/** The scroll-driven one-pager: hero → about → skills → work → voices → contact. */
const Home = () => (
  <div className="relative bg-background text-ink">
    <SchematicRail sections={HOME_SECTIONS} />
    <Hero />
    <About />
    <Skills />
    <FeaturedProjects />
    <TestimonialsSection />
    <Contact />
  </div>
);

export default Home;
