import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import Nav from "./chrome/Nav";
import Cursor from "./chrome/Cursor";
import Preloader from "./chrome/Preloader";
import Footer from "./Footer";
import { SmoothScroll, ScrollManager, PageTransitionProvider } from "../motion";
import useRouteSeo from "../seo/useRouteSeo";

// Deferred globals: none are needed for first paint, and the chatbot alone
// drags react-markdown + a syntax highlighter into whatever chunk holds it.
const AIChatbot = lazy(() => import("./AIChatbot"));
const CommandPalette = lazy(() => import("./CommandPalette"));
const Terminal = lazy(() => import("./Terminal"));
const AvatarNavigator = lazy(() => import("./avatar/AvatarNavigator"));

/** Mounts children after the main thread goes idle post-load. */
const useIdleMount = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);
  return ready;
};

/** Placeholder while a lazy route chunk loads (PageTransition waits on it). */
const RouteLoading = () => (
  <div data-route-loading className="grid min-h-[100svh] place-items-center">
    <span className="hud">Loading</span>
  </div>
);

const RouterLayout = () => {
  const extrasReady = useIdleMount();
  const { pathname } = useLocation();
  useRouteSeo();

  return (
    <ThemeProvider>
      <SmoothScroll>
        <PageTransitionProvider>
          <a
            href="#main-content"
            data-transition="none"
            className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>

          <ScrollManager />
          <Nav />

          <main id="main-content" data-path={pathname} tabIndex={-1} className="relative outline-none">
            <Suspense fallback={<RouteLoading />}>
              <Outlet />
            </Suspense>
          </main>

          <Footer />

          {extrasReady && (
            <Suspense fallback={null}>
              <AIChatbot />
              <CommandPalette />
              <Terminal />
              <AvatarNavigator />
            </Suspense>
          )}

          <div className="grain" aria-hidden="true" />
          <Preloader />
          <Cursor />
        </PageTransitionProvider>
      </SmoothScroll>
    </ThemeProvider>
  );
};

export default RouterLayout;
