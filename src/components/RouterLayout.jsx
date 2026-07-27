import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ActiveContextProvider } from "../contextState";
import { ThemeProvider } from "../context/ThemeContext";
import { RecruiterModeProvider } from "../context/RecruiterModeContext";
import Nav from "./schematic/Nav";
import Cursor from "./schematic/Cursor";
import BootLoader from "./schematic/BootLoader";
import Footer from "./Footer";
import { SmoothScroll, ScrollManager } from "../motion";

// Deferred globals: none are needed for first paint, and the chatbot alone
// drags react-markdown + a syntax highlighter into whatever chunk holds it.
const AIChatbot = lazy(() => import("./AIChatbot"));
const CommandPalette = lazy(() => import("./CommandPalette"));
const Terminal = lazy(() => import("./Terminal"));
const Iridescence = lazy(() => import("./ui/Iridescence"));

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
  const [enableIridescence, setEnableIridescence] = useState(false);
  const { pathname } = useLocation();
  const extrasReady = useIdleMount();

  useEffect(() => {
    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallMql = window.matchMedia("(max-width: 0px)");

    const update = () => {
      const saveData = navigator?.connection?.saveData;
      setEnableIridescence(
        !(reduceMql.matches || smallMql.matches || saveData),
      );
    };

    update();
    reduceMql.addEventListener("change", update);
    smallMql.addEventListener("change", update);
    return () => {
      reduceMql.removeEventListener("change", update);
      smallMql.removeEventListener("change", update);
    };
  }, []);

  return (
    <ThemeProvider>
      <RecruiterModeProvider>
        <ActiveContextProvider>
          <SmoothScroll>
          <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300 bg-background text-foreground">
            {/* Skip link — first focusable element on the page */}
            <a
              href="#main-content"
              className="fixed left-4 top-4 z-[300] -translate-y-24 border border-signal bg-background px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-signal transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              Skip to content
            </a>

            {/* Iridescence Background — legacy routes only; the home page
                sits on the opaque schematic ground */}
            {enableIridescence && pathname !== "/" && (
              <Suspense fallback={null}>
                <div className="fixed inset-0 z-0 opacity-25 pointer-events-none">
                  <Iridescence
                    color={[0.9, 0.8, 0.3]}
                    speed={0.6}
                    amplitude={0.1}
                    quality={0.7}
                    mouseReact={false}
                  />
                </div>
              </Suspense>
            )}

            {/* Navigation */}
            <ScrollManager />
            <Nav />

            {/* Main Content */}
            <main id="main-content" className="relative">
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
        </ActiveContextProvider>
      </RecruiterModeProvider>
    </ThemeProvider>
  );
};

export default RouterLayout;
