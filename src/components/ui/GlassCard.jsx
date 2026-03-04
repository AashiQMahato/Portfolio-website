import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = true, glow = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        glass rounded-2xl
        ${hover ? "glass-hover transition-all duration-300 cursor-pointer" : ""}
        ${glow ? "glow-primary" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
