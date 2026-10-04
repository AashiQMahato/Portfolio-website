import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap, Flip } from "./gsapSetup";
import { DUR, EASE } from "./tokens";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import { getRouteMeta } from "../seo/meta";

/**
 * Route transitions.
 *
 *  curtain  default for internal links: a panel rises over the page with
 *           the destination's name, the route swaps underneath, the panel
 *           exits upward — one continuous direction of travel.
 *  project  links marked data-transition="project": the clicked image is
 *           lifted into a fixed layer and Flip-expanded to fill the
 *           viewport, becoming the full-bleed hero of the case study.
 *
 * Clicks are intercepted in the capture phase so React Router never sees
 * them; modified clicks, new tabs, downloads, hash-only and same-page links
 * fall through untouched. Back/forward use native behaviour. Reduced motion
 * skips both transitions entirely.
 */
const Ctx = createContext({ go: () => {} });
export const usePageTransition = () => useContext(Ctx);

const shortTitle = (pathname) => {
  if (pathname === "/") return "Aashik Kumar Mahato";
  const t = getRouteMeta(pathname).title || "";
  return t.split(/ \| | — /)[0];
};

/**
 * Resolve once <main> has rendered `path` (RouterLayout mirrors the current
 * pathname into data-path) and no lazy chunk is still suspended.
 */
const pageReady = (path, timeout = 2500) =>
  new Promise((resolve) => {
    const start = performance.now();
    const check = () => {
      const main = document.getElementById("main-content");
      const ready = main?.dataset.path === path && !main.querySelector("[data-route-loading]");
      if (ready || performance.now() - start > timeout) {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      } else {
        setTimeout(check, 30);
      }
    };
    check();
  });

/**
 * The image a project link should expand from: its own visible image, its
 * card's (for text CTAs), or the open hover preview (project index). Hidden
 * or zero-size candidates are skipped; none found → curtain instead.
 */
const sourceImage = (a) => {
  const shown = (img) => {
    if (!img) return false;
    const r = img.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  };
  const preview = a.dataset.previewKey
    ? document.querySelector(`[data-preview="${a.dataset.previewKey}"]`)
    : null;
  const previewOpen = preview && /inset\(0%/.test(preview.style.clipPath);
  return [
    ...a.querySelectorAll("img"),
    ...(a.closest("article, [data-project]")?.querySelectorAll("img") ?? []),
    previewOpen ? preview.querySelector("img") : null,
  ].find(shown) ?? null;
};

export const PageTransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  const curtain = useRef(null);
  const label = useRef(null);
  const busy = useRef(false);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const runCurtain = useCallback(
    async (to) => {
      const url = new URL(to, window.location.origin);
      label.current.textContent = shortTitle(url.pathname);
      const tl = gsap.timeline();
      tl.set(curtain.current, { yPercent: 100, autoAlpha: 1 })
        .to(curtain.current, { yPercent: 0, duration: DUR.base, ease: EASE.inOut })
        .fromTo(
          label.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.strong },
          "-=0.3",
        );
      await tl;
      navigate(to);
      await pageReady(url.pathname);
      await gsap
        .timeline()
        // Exit runs ~70% of the entrance so the new page arrives promptly.
        .to(label.current, { yPercent: -60, opacity: 0, duration: 0.2, ease: "power2.in" })
        .to(curtain.current, { yPercent: -100, duration: 0.45, ease: EASE.inOut }, "<0.05");
      gsap.set(curtain.current, { autoAlpha: 0 });
    },
    [navigate],
  );

  const runProject = useCallback(
    async (to, img) => {
      const rect = img.getBoundingClientRect();
      const layer = document.createElement("div");
      layer.setAttribute("aria-hidden", "true");
      layer.dataset.chrome = "";
      Object.assign(layer.style, {
        position: "fixed",
        zIndex: "95", // under the nav (100): navigation stays anchored
        overflow: "hidden",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: getComputedStyle(img.parentElement).borderRadius,
      });
      const clone = img.cloneNode();
      clone.removeAttribute("data-reveal-img");
      Object.assign(clone.style, { width: "100%", height: "100%", objectFit: "cover", transform: "none" });
      layer.appendChild(clone);
      // Same scrim as the case-study hero, faded in during the expansion so
      // the final frame matches the destination and the crossfade is unseen.
      const scrim = document.createElement("div");
      scrim.className = "absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10";
      scrim.style.opacity = "0";
      layer.appendChild(scrim);
      document.body.appendChild(layer);

      // Flip: record the in-page box, jump to full-bleed, animate the delta.
      const state = Flip.getState(layer);
      Object.assign(layer.style, { left: "0px", top: "0px", width: "100vw", height: "100svh", borderRadius: "0px" });
      gsap.to(scrim, { opacity: 1, duration: DUR.enter, ease: EASE.inOut });
      await Flip.from(state, { duration: DUR.enter, ease: EASE.inOut, absolute: true });

      navigate(to);
      await pageReady(new URL(to, window.location.origin).pathname);
      await gsap.to(layer, { opacity: 0, duration: DUR.base, ease: EASE.soft, delay: 0.1 });
      layer.remove();
    },
    [navigate],
  );

  const go = useCallback(
    async (to, opts = {}) => {
      if (busy.current) return;
      if (reduced) {
        navigate(to);
        return;
      }
      busy.current = true;
      try {
        if (opts.image) await runProject(to, opts.image);
        else await runCurtain(to);
      } finally {
        busy.current = false;
      }
    },
    [navigate, reduced, runCurtain, runProject],
  );

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.transition === "none") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // files (PDF, XML…)
      if (url.pathname === pathRef.current) return; // same page: hash scroll
      e.preventDefault();
      e.stopPropagation();
      const img = a.dataset.transition === "project" ? sourceImage(a) : null;
      go(url.pathname + url.search + url.hash, { image: img });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [go]);

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        data-chrome
        className="invisible fixed inset-0 z-[150] flex items-center justify-center bg-panel opacity-0"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-signal" />
        <div className="overflow-clip px-6">
          <p ref={label} className="text-center text-display-2 text-ink" />
        </div>
        <p className="hud absolute bottom-8 left-1/2 -translate-x-1/2">Loading</p>
      </div>
    </Ctx.Provider>
  );
};

PageTransitionProvider.propTypes = { children: PropTypes.node };
