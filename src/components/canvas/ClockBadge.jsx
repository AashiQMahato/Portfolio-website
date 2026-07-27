import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

/**
 * Live studio clock pill — "LIVE · KTM 14:32:07". Ticks every second in the
 * site owner's timezone (Kathmandu, UTC+5:45).
 */
const ClockBadge = ({ className = "", prefix = "KTM", seconds = true, pill = true }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        ...(seconds ? { second: "2-digit" } : {}),
        hour12: false,
        timeZone: "Asia/Kathmandu",
      }),
    [seconds],
  );

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-ink-dim ${
        pill ? "pill px-3 py-1" : ""
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      LIVE · {prefix} {fmt.format(now)}
    </span>
  );
};

ClockBadge.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.string,
  seconds: PropTypes.bool,
  pill: PropTypes.bool,
};

export default ClockBadge;
