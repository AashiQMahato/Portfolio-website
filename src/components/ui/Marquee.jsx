const Marquee = ({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
}) => {
  const animationClass = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex ${animationClass} ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 gap-8">{children}</div>
        <div className="flex shrink-0 gap-8" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
};

export default Marquee;
