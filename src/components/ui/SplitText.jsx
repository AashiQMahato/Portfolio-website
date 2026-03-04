import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SplitText = ({
  text = "",
  tag: Tag = "h1",
  className = "",
  delay = 30,
  duration = 0.8,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  onComplete,
}) => {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const spans = el.querySelectorAll(".split-char");
          gsap.fromTo(
            spans,
            from,
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              onComplete,
            }
          );
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay, duration, ease, from, to, threshold, onComplete]);

  const renderContent = () => {
    if (splitType === "words") {
      return text.split(" ").map((word, i) => (
        <span key={i} className="split-char inline-block opacity-0" style={{ marginRight: "0.3em" }}>
          {word}
        </span>
      ));
    }
    return text.split("").map((char, i) => (
      <span key={i} className="split-char inline-block opacity-0" style={char === " " ? { width: "0.3em" } : {}}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <Tag ref={containerRef} className={className}>
      {renderContent()}
    </Tag>
  );
};

export default SplitText;
