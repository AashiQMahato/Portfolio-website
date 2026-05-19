import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const RotatingText = ({ words = [], interval = 3000, className = "" }) => {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const safeWords = useMemo(
    () => (Array.isArray(words) ? words.filter(Boolean) : []),
    [words],
  );

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (safeWords.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeWords.length);
    }, interval);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, safeWords, interval]);

  const current = safeWords.length ? safeWords[index % safeWords.length] : "";

  return (
    <span className={`inline-block relative ${className}`}>
      {shouldReduceMotion ? (
        <span className="inline-block">{current}</span>
      ) : (
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="inline-block will-change-transform">
            {current}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
};

export default RotatingText;
