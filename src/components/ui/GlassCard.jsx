import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  hover = true,
  glow = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl border border-border bg-card/80 shadow-sm
        ${hover ? "transition-all duration-300 cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-1" : ""}
        ${glow ? "glow-primary" : ""}
        ${className}
      `}
      {...props}>
      {children}
    </motion.div>
  );
};

export default GlassCard;
