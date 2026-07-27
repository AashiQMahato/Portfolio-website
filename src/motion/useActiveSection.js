import { useEffect, useState } from "react";

/**
 * Tracks which section id currently crosses the viewport's center band.
 * Pass the ordered list of section element ids; returns the active id
 * (or null when none of the elements exist, e.g. on other routes).
 */
export default function useActiveSection(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(null);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) {
      setActive(null);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Thin band around 45% viewport height — one section wins at a time.
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}
