import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Mail, Phone, Award, Users, Lightbulb, BookOpen } from "lucide-react";
import { ScrollReveal, GlassCard, SectionHeader } from "./ui";
import profileImage from "../assets/12.jpg";

const About = () => {
  const stats = [
    { value: "15+", label: "Technologies", icon: Award },
    { value: "8+", label: "Projects", icon: Lightbulb },
    { value: "4+", label: "Years Exp.", icon: Calendar },
    { value: "10+", label: "Collaborations", icon: Users },
  ];

  const personalInfo = [
    { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
    { icon: Mail, label: "Email", value: "aashikmahato9567@gmail.com" },
    { icon: Phone, label: "Phone", value: "+977-9808711811" },
    { icon: Calendar, label: "Experience", value: "4+ Years" },
  ];

  const skills = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "Arduino", "Raspberry Pi", "IoT", "MongoDB", "Express.js",
    "C/C++", "Git", "Tailwind CSS", "Next.js", "TensorFlow",
  ];

  const values = [
    {
      title: "Innovation",
      icon: Lightbulb,
      description: "Developing creative solutions bridging hardware and software.",
      gradient: "from-primary-500 to-primary-600",
    },
    {
      title: "Excellence",
      icon: Award,
      description: "Maintaining high standards in both embedded systems and web dev.",
      gradient: "from-secondary-500 to-secondary-600",
    },
    {
      title: "Collaboration",
      icon: Users,
      description: "Working effectively in cross-functional teams.",
      gradient: "from-accent-500 to-accent-600",
    },
    {
      title: "Learning",
      icon: BookOpen,
      description: "Staying current with emerging technologies.",
      gradient: "from-primary-400 to-secondary-500",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-40 h-[500px] bg-primary-500/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-40 h-[400px] bg-secondary-500/8 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="About Me"
            title={<>Get to Know <span className="gradient-text">Me Better</span></>}
            description="Electronics Engineer & Full Stack Developer based in Kathmandu, Nepal. Passionate about building innovative solutions at the intersection of hardware and software."
          />

          {/* Main Content Grid */}
          <div className="grid gap-12 mb-20 lg:grid-cols-5 lg:gap-16">
            {/* Left - Photo & Info */}
            <ScrollReveal className="lg:col-span-2" direction="left">
              <div className="space-y-8">
                {/* Profile Image */}
                <div className="relative w-64 h-64 mx-auto lg:w-full lg:h-80">
                  <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-3xl blur-xl" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden glass p-[2px]">
                    <img
                      src={profileImage}
                      alt="Aashiq Mahato"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  {personalInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <div key={info.label} className="flex items-center gap-3 p-3 transition-all rounded-xl glass glass-hover">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10">
                          <Icon className="w-4 h-4 text-primary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-dark-500">{info.label}</p>
                          <p className="text-sm font-medium text-dark-200">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Right - Content */}
            <div className="space-y-10 lg:col-span-3">
              {/* Bio */}
              <ScrollReveal delay={0.2}>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-display">
                    Electronics Engineer & <span className="gradient-text">Full-Stack Developer</span>
                  </h3>
                  <p className="leading-relaxed text-dark-400">
                    I'm Aashik Kumar Mahato, an Electronics, Communication, and Information Engineering
                    student at the Advanced College of Engineering and Management, Kathmandu. With a
                    passion for bridging the physical and digital worlds, I specialize in IoT systems,
                    embedded programming, and modern web development.
                  </p>
                  <p className="leading-relaxed text-dark-400">
                    My journey spans from designing smart hardware prototypes to building full-stack
                    web applications. I believe in continuous learning and delivering excellent experiences
                    through thoughtful engineering.
                  </p>
                </div>
              </ScrollReveal>

              {/* Stats Grid */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <GlassCard key={stat.label} className="p-4 text-center">
                        <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                          <Icon className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="text-2xl font-bold text-dark-100 font-display">{stat.value}</div>
                        <div className="text-xs text-dark-500">{stat.label}</div>
                      </GlassCard>
                    );
                  })}
                </div>
              </ScrollReveal>

              {/* Skill Pills */}
              <ScrollReveal delay={0.4}>
                <h4 className="mb-4 text-lg font-semibold font-display">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg glass glass-hover text-dark-300 cursor-default transition-colors hover:text-primary-300"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} delay={i * 0.1}>
                  <GlassCard className="h-full p-6 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="mb-2 text-lg font-bold font-display">{value.title}</h4>
                    <p className="text-sm leading-relaxed text-dark-400">{value.description}</p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
