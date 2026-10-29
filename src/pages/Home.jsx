import Hero from "../sections/hero/Hero";
import Statement from "../sections/statement/Statement";
import SelectedWork from "../sections/work/SelectedWork";
import About from "../sections/About";
import Experience from "../sections/Experience";
import Capabilities from "../sections/capabilities/Capabilities";
import ResumeCta from "../sections/ResumeCta";
import Contact from "../sections/contact/Contact";

/**
 * The narrative: identity → philosophy → proof → person → journey →
 * range → the compact version → action.
 */
const Home = () => (
  <>
    <Hero />
    <Statement />
    <SelectedWork />
    <About />
    <Experience />
    <Capabilities />
    <ResumeCta />
    <Contact />
  </>
);

export default Home;
