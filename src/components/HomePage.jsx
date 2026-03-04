import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, Mail, ChevronDown } from "lucide-react";
import { SplitText, RotatingText, Magnet, ScrollReveal } from "./ui";
import profileImage from "../assets/12.jpg";

const HomePage = () => {
  const roles = ["Electronics Engineer", "Full Stack Developer", "IoT Specialist", "Problem Solver"];

  const socialLinks = [
    { icon: Github, href: "https://github.com/aashik9567", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:aashikmahato9567@gmail.com", label: "Email" },
  ];


  return (
    <div className="relative flex items-center min-h-screen overflow-hidden">
      {/* Ambient Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full section-padding pt-28 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Text */}
            <div className="order-2 lg:order-1">
              {/* Status Badge */}
              <ScrollReveal delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full glass text-primary-300">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Available for opportunities
                </div>
              </ScrollReveal>

              {/* Main Heading with SplitText */}
              <div className="mb-4">
                <SplitText
                  text="Hi, I'm"
                  tag="h1"
                  className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl font-display text-dark-100"
                  delay={40}
                  splitType="chars"
                />
              </div>
              <div className="mb-6">
                <SplitText
                  text="Aashiq Mahato"
                  tag="h1"
                  className="text-4xl font-bold leading-tight text-purple-400 sm:text-5xl lg:text-6xl xl:text-7xl font-display"
                  delay={40}
                  splitType="chars"
                />
              </div>

              {/* Rotating Role */}
              <ScrollReveal delay={0.3}>
                <div className="flex items-center h-10 gap-3 mb-8">
                  <span className="font-mono text-lg text-dark-500">&lt;</span>
                  <RotatingText
                    words={roles}
                    interval={3000}
                    className="text-xl font-semibold sm:text-2xl text-primary-300 font-display"
                  />
                  <span className="font-mono text-lg text-dark-500">/&gt;</span>
                </div>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal delay={0.4}>
                <p className="max-w-lg mb-10 text-lg leading-relaxed text-dark-400">
                  Electronics Engineering student passionate about building innovative solutions
                  at the intersection of hardware and software. Specializing in IoT, embedded systems,
                  and modern web technologies.
                </p>
              </ScrollReveal>

              {/* CTA Buttons */}
              <ScrollReveal delay={0.5}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Magnet strength={0.15}>
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      View Projects
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Magnet>
                  <a
                    href="/src/assets/AashikKumarMahatoResume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold glass glass-hover text-dark-200 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    Download CV
                  </a>
                </div>
              </ScrollReveal>

              {/* Social Links */}
              <ScrollReveal delay={0.6}>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-dark-500">Connect:</span>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <Magnet key={social.label} strength={0.2}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center transition-all duration-300 w-11 h-11 rounded-xl glass glass-hover text-dark-400 hover:text-primary-400"
                            aria-label={social.label}
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        </Magnet>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Avatar */}
            <ScrollReveal direction="right" delay={0.3} className="flex justify-center order-1 lg:order-2">
              <Magnet strength={0.1}>
                <div className="relative">
                  {/* Glow behind image */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />

                  {/* Avatar container */}
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
                      <div className="w-full h-full overflow-hidden rounded-3xl bg-dark-950">
                        <img
                          src={profileImage}
                          alt="Aashiq Mahato"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Magnet>
            </ScrollReveal>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute flex flex-col items-center gap-2 -translate-x-1/2 cursor-pointer bottom-8 left-1/2"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <span className="text-xs tracking-wider uppercase text-dark-500">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5 text-dark-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
