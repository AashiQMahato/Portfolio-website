import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PillButton, SelectionBox } from "../components/canvas";

/** Catch-all route: answers "where am I / how do I get out" instead of a blank canvas. */
const NotFound = () => (
  <section
    aria-labelledby="not-found-heading"
    className="flex min-h-[80vh] items-center justify-center px-5 pb-16 pt-32 md:px-10"
  >
    <SelectionBox name="404.fig" tone="dim" className="panel max-w-lg rounded-2xl">
      <div className="px-8 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-dim">Error 404</p>
        <h1 id="not-found-heading" className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
          This frame is empty.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-dim">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillButton as={Link} to="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </PillButton>
          <PillButton as={Link} to="/projects" variant="outline">
            Browse projects
          </PillButton>
        </div>
      </div>
    </SelectionBox>
  </section>
);

export default NotFound;
