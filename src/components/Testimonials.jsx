import React from "react";
import { Quote } from "lucide-react";
import { Marquee, SectionHeader, ScrollReveal } from "./ui";

const testimonials = [
  {
    name: "Dr. Rajan Sharma",
    role: "Professor, ACEM",
    content: "Aashiq demonstrated exceptional skills in his IoT project. His ability to bridge hardware and software is remarkable.",
    avatar: "RS",
  },
  {
    name: "Bikash Thapa",
    role: "Team Lead, Smart Stick Project",
    content: "Working with Aashiq on the Ultrasonic Blind Stick was inspiring. His technical depth in embedded systems is outstanding.",
    avatar: "BT",
  },
  {
    name: "Priya Adhikari",
    role: "Project Partner",
    content: "His full-stack development skills and clean code practices made our Attendance System project a huge success.",
    avatar: "PA",
  },
  {
    name: "Suman KC",
    role: "Classmate, ACEM",
    content: "Aashiq is an incredible problem solver. He always finds elegant solutions to complex engineering challenges.",
    avatar: "SK",
  },
  {
    name: "Anish Gurung",
    role: "Mentor",
    content: "One of the most dedicated students I've seen. His passion for continuous learning and innovation is truly admirable.",
    avatar: "AG",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="glass rounded-2xl p-6 w-[340px] sm:w-[380px] shrink-0 hover:bg-white/[0.06] transition-all">
    <Quote className="w-8 h-8 text-primary-500/30 mb-4" />
    <p className="text-sm text-dark-300 leading-relaxed mb-6 line-clamp-4">
      "{testimonial.content}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
        {testimonial.avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-dark-200">{testimonial.name}</p>
        <p className="text-xs text-dark-500">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <div className="relative py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10">
        <div className="section-padding pb-0">
          <SectionHeader
            badge="Testimonials"
            title={<>What People <span className="gradient-text">Say</span></>}
            description="Feedback from colleagues, professors, and collaborators I've worked with."
          />
        </div>

        {/* Marquee Row 1 */}
        <Marquee speed={35} className="mb-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </Marquee>

        {/* Marquee Row 2 - Reverse */}
        <Marquee speed={40} direction="right">
          {[...testimonials].reverse().map((t) => (
            <TestimonialCard key={t.name + "-rev"} testimonial={t} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Testimonials;
