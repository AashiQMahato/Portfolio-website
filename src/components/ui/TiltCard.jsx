import { useRef, useState } from "react";
import { motion } from "framer-motion";

const TiltCard = ({ children, className = "", tiltStrength = 15, glare = true }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform({
      rotateX: (y - 0.5) * -tiltStrength,
      rotateY: (x - 0.5) * tiltStrength,
    });
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={transform}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`perspective-1000 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {children}
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TiltCard;
