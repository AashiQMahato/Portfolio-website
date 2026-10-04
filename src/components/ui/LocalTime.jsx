import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kathmandu",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Kathmandu wall-clock time (UTC+5:45), updated each minute. */
const LocalTime = ({ className = "" }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const align = setTimeout(() => {
      tick();
      id = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    let id;
    return () => {
      clearTimeout(align);
      clearInterval(id);
    };
  }, []);
  return (
    <time dateTime={now.toISOString()} className={`tabular-nums ${className}`}>
      {fmt.format(now)} <span className="text-ink-dim">NPT</span>
    </time>
  );
};

LocalTime.propTypes = { className: PropTypes.string };

export default LocalTime;
