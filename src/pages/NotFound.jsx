import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, SplitText } from "../motion";
import { MagneticButton } from "../components/ui";
import Avatar from "../components/avatar/Avatar";

/** Catch-all route: says where you are and offers two ways out. */
const NotFound = () => (
  <section
    aria-labelledby="not-found-title"
    className="shell flex min-h-[100svh] flex-col justify-center pb-16 pt-[var(--nav-h)]"
  >
    <Avatar animation="confused" className="mb-8 h-28 w-28 md:h-36 md:w-36" />
    <p className="hud mb-8">
      <span className="text-accent-ink">Error 404</span> — No signal on this route
    </p>
    <Reveal variant="lines">
      <SplitText as="h1" id="not-found-title" lines={["This frame", "is empty."]} className="text-display text-ink" />
    </Reveal>
    <p className="mt-8 max-w-md text-lede text-ink-dim">
      The page you&apos;re looking for doesn&apos;t exist or has moved.
    </p>
    <div className="mt-10 flex flex-wrap gap-3">
      <MagneticButton as={Link} to="/" variant="signal" icon={ArrowLeft} iconDirection="right">
        Back to home
      </MagneticButton>
      <MagneticButton as={Link} to="/projects" variant="outline" icon={ArrowRight} iconDirection="right">
        Browse projects
      </MagneticButton>
    </div>
  </section>
);

export default NotFound;
