import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { RecruiterModeProvider } from "../context/RecruiterModeContext";
import Nav from "./chrome/Nav";
import Cursor from "./chrome/Cursor";
import BootLoader from "./chrome/BootLoader";
import Footer from "./Footer";
import { CssSky, Ruler } from "./canvas";
import { SmoothScroll, ScrollManager } from "../motion";

// Deferred globals: none are needed for first paint, and the chatbot alone
// drags react-markdown + a syntax highlighter into whatever chunk holds it.
const AIChatbot = lazy(() => import("./AIChatbot"));
const CommandPalette = lazy(() => import("./CommandPalette"));
const Terminal = lazy(() => import("./Terminal"));

/** Mounts children after the main thread goes idle post-load. */
const useIdleMount = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 2500,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);
  return ready;
};

const RouterLayout = () => {
  const extrasReady = useIdleMount();

  return (
    <ThemeProvider>
      <RecruiterModeProvider>
        <SmoothScroll>
          <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
            {/* Skip link — first focusable element on the page */}
            <a
              href="#main-content"
              className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full border border-signal bg-panel px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-ink transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              Skip to content
            </a>

            {/* Ambient sky background — every route. The home page layers
                the WebGL SkyScene above this; elsewhere it stands alone. */}
            <CssSky />

            {/* Canvas chrome + navigation */}
            <ScrollManager />
            <Ruler />
            <Nav />

            {/* Main Content */}
            <main id="main-content" className="relative z-10">
              <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* Deferred globals: chatbot FAB, ⌘K palette, terminal mode */}
            {extrasReady && (
              <Suspense fallback={null}>
                <AIChatbot />
                <CommandPalette />
                <Terminal />
              </Suspense>
            )}

            {/* Global: boot sequence + custom cursor */}
            <BootLoader />
            <Cursor />
          </div>
        </SmoothScroll>
      </RecruiterModeProvider>
    </ThemeProvider>
  );
};

export default RouterLayout;
