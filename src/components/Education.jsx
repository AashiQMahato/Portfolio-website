import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Calendar } from "lucide-react";
import { ScrollReveal, SectionHeader, GlassCard } from "./ui";

const educationData = [
  {
    degree: "B.E. in Electronics, Communication & Information",
    institution: "Advanced College of Engineering and Management",
    year: "2021 - 2025",
    location: "Kalanki, Kathmandu",
    description: "Focused on cutting-edge technologies in electronics and communication systems with emphasis on practical applications.",
    courses: ["Digital Logic Design", "Computer Networks", "Embedded Systems", "Signal Processing"],
    achievements: ["Machine Learning", "Artificial Intelligence", "Hardware Experience"],
    gradient: "from-primary-500 to-primary-600",
    icon: "\u{1F393}",
  },
  {
    degree: "Higher Secondary Education (Science)",
    institution: "Prasadi Academy",
    year: "2018 - 2020",
    location: "Jawlakhel, Lalitpur",
    description: "Built a strong foundation in science, mathematics, and computing for advanced studies in engineering.",
    courses: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
    achievements: ["Science Focus", "Academic Excellence", "Technical Leadership"],
    gradient: "from-secondary-500 to-secondary-600",
    icon: "\u{1F4DA}",
  },
  {
    degree: "Secondary Education Examination (SEE)",
    institution: "Swastik Pathshala",
    year: "2014 - 2017",
    location: "Siraha, Nepal",
    description: "Developed essential skills in mathematics, science, and technology.",
    courses: ["Mathematics", "Science", "English", "Social Studies"],
    achievements: ["Foundational Knowledge", "Community Engagement", "Leadership"],
    gradient: "from-accent-500 to-accent-600",
    icon: "\u{1F3EB}",
  },
];

const learningGoals = [
  { title: "Advanced IoT Systems", progress: 35, icon: "\u{1F310}", color: "from-primary-500 to-primary-600" },
  { title: "AI for Electronics", progress: 60, icon: "\u{1F916}", color: "from-secondary-500 to-secondary-600" },
  { title: "Embedded Systems", progress: 45, icon: "\u26A1", color: "from-accent-500 to-accent-600" },
  { title: "Signal Processing", progress: 25, icon: "\u{1F4E1}", color: "from-primary-400 to-secondary-500" },
];

const TimelineCard = ({ education, index, isLeft }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className={`flex items-center gap-8 mb-16 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-[calc(50%-2rem)]"
      >
        <GlassCard className="p-6 lg:p-8" hover={true}>
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${education.gradient} flex items-center justify-center text-xl shrink-0`}>
              {education.icon}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-gradient-to-r ${education.gradient} text-white`}>
                {education.year}
              </span>
              <h3 className="text-lg font-bold font-display text-dark-100">{education.degree}</h3>
            </div>
          </div>

          {/* Institution */}
          <div className="flex items-center gap-2 mb-3 ml-16">
            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${education.gradient}`} />
            <p className="text-sm font-medium text-primary-300">{education.institution}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 ml-16 text-xs text-dark-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{education.location}</span>
          </div>

          <p className="mb-4 ml-16 text-sm leading-relaxed text-dark-400">{education.description}</p>

          {/* Courses */}
          <div className="mb-4 ml-16">
            <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase text-dark-300">Key Courses</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {education.courses.map((course) => (
                <div key={course} className="flex items-center gap-2 text-xs text-dark-400">
                  <span className="w-1 h-1 rounded-full bg-dark-600" />
                  {course}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-2 ml-16">
            {education.achievements.map((ach) => (
              <span key={ach} className="px-2.5 py-1 text-xs font-medium rounded-full glass text-dark-300">
                {ach}
              </span>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Timeline Dot - Desktop only */}
      <div className="flex-col items-center hidden lg:flex">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`w-5 h-5 rounded-full bg-gradient-to-br ${education.gradient} shadow-lg ring-4 ring-dark-950`}
        />
      </div>

      {/* Empty space for alternate side */}
      <div className="hidden lg:block w-[calc(50%-2rem)]" />
    </div>
  );
};

const Education = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 h-[500px] bg-primary-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-0 h-[400px] bg-secondary-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="Education"
            title={<>Academic <span className="gradient-text">Journey</span></>}
            description="Building a strong foundation in electronics engineering and computer science."
          />

          {/* Timeline */}
          <div className="relative">
            {/* Center line - Desktop */}
            <div className="absolute top-0 bottom-0 hidden w-px -translate-x-1/2 lg:block left-1/2 bg-gradient-to-b from-primary-500/30 via-secondary-500/30 to-accent-500/30" />

            {educationData.map((edu, i) => (
              <TimelineCard key={edu.degree} education={edu} index={i} isLeft={i % 2 === 0} />
            ))}
          </div>

          {/* Learning Goals */}
          <ScrollReveal>
            <div className="p-8 mt-8 glass rounded-2xl lg:p-12">
              <div className="mb-10 text-center">
                <div className="inline-block p-3 mb-4 rounded-xl bg-gradient-to-r from-secondary-500/20 to-primary-500/20">
                  <span className="text-2xl">{"\u{1F3AF}"}</span>
                </div>
                <h3 className="mb-2 text-2xl font-bold font-display">Future Learning Goals</h3>
                <p className="text-dark-400">Continuous learning and skill development</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {learningGoals.map((goal, i) => (
                  <ScrollReveal key={goal.title} delay={i * 0.1}>
                    <div className="glass rounded-xl p-5 text-center hover:bg-white/[0.06] transition-all group">
                      <div className="mb-3 text-3xl">{goal.icon}</div>
                      <h4 className="mb-4 text-sm font-semibold text-dark-200">{goal.title}</h4>
                      <div className="relative">
                        <div className="flex justify-between text-xs text-dark-500 mb-1.5">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${goal.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                            className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Education;
