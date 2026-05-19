import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const Magnet = ({ children, strength = 0.3, className = "" }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = {
    stiffness: 220,
    damping: 22,
    mass: 0.15,
  };

  const xSpring = useSpring(x, spring);
  const ySpring = useSpring(y, spring);

  const rafRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouse = (e) => {
    if (shouldReduceMotion) return;
    const node = ref.current;
    if (!node) return;

    const { clientX, clientY } = e;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = node.getBoundingClientRect();
      const nextX = (clientX - left - width / 2) * strength;
      const nextY = (clientY - top - height / 2) * strength;
      x.set(nextX);
      y.set(nextY);
    });
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={shouldReduceMotion ? undefined : { x: xSpring, y: ySpring }}
      className={className}>
      {children}
    </motion.div>
  );
};

export default Magnet;
