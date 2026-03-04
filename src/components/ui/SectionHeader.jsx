import ScrollReveal from "./ScrollReveal";

const SectionHeader = ({ badge, title, description, className = "" }) => {
  return (
    <ScrollReveal className={`text-center mb-16 lg:mb-20 ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full glass text-primary-300">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl mx-auto text-lg text-dark-400 leading-relaxed">
          {description}
        </p>
      )}
    </ScrollReveal>
  );
};

export default SectionHeader;
