import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github, Instagram, User, AtSign, MessageCircle, Send, CheckCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import { ScrollReveal, SectionHeader, GlassCard, Magnet } from "./ui";

const contactInfo = [
  { icon: Phone, title: "Phone", content: "+977-9808711811", color: "text-primary-400", bg: "bg-primary-500/10" },
  { icon: Mail, title: "Email", content: "aashikmahato9567@gmail.com", color: "text-secondary-400", bg: "bg-secondary-500/10" },
  { icon: MapPin, title: "Location", content: "Kathmandu, Nepal", color: "text-accent-400", bg: "bg-accent-500/10" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/aashik9567", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/aashiq__mahato/", label: "Instagram" },
];

const ContactUs = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", user_email: "", subject: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await emailjs.sendForm("service_oe9gxpe", "template_9wp6q8s", formRef.current, "BFWbJjRatPX36zT7V");
      setFormData({ user_name: "", user_email: "", subject: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Failed to send message. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full py-3.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all";

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 bg-primary-500/5 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 h-80 bg-secondary-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="Contact"
            title={<>Get In <span className="gradient-text">Touch</span></>}
            description="Ready to bring your ideas to life? Let's discuss your next project."
          />

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Left Column - Info */}
            <ScrollReveal direction="left" className="space-y-6 lg:col-span-2">
              {/* Contact Cards */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="mb-5 text-lg font-semibold font-display">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${item.bg}`}>
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs text-dark-500">{item.title}</p>
                          <p className="text-sm font-medium text-dark-200">{item.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Social Links */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="mb-5 text-lg font-semibold font-display">Connect With Me</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Magnet key={social.label} strength={0.2}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center transition-all w-11 h-11 rounded-xl glass glass-hover text-dark-400 hover:text-primary-400"
                          title={social.label}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      </Magnet>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Available Badge */}
              <div className="p-5 text-center glass rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="relative flex w-3 h-3">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                    <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-emerald-400">Currently Available</span>
                </div>
                <p className="text-xs text-dark-500">Open to freelance & full-time opportunities</p>
              </div>
            </ScrollReveal>

            {/* Right Column - Form */}
            <ScrollReveal direction="right" className="lg:col-span-3">
              <GlassCard className="p-6 lg:p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display">Send Message</h3>
                    <p className="text-xs text-dark-500">I'll respond within 24 hours</p>
                  </div>
                </div>

                {submitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 text-center border rounded-xl bg-emerald-500/10 border-emerald-500/20">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                    <h4 className="mb-1 text-lg font-semibold text-emerald-400">Message Sent!</h4>
                    <p className="text-sm text-emerald-300/70">Thanks for reaching out. I'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="relative">
                        <User className="absolute w-4 h-4 -translate-y-1/2 left-4 top-1/2 text-dark-500" />
                        <input type="text" name="user_name" placeholder="Your Name" value={formData.user_name} onChange={handleChange} required className={`${inputClass} pl-11`} />
                      </div>
                      <div className="relative">
                        <AtSign className="absolute w-4 h-4 -translate-y-1/2 left-4 top-1/2 text-dark-500" />
                        <input type="email" name="user_email" placeholder="Your Email" value={formData.user_email} onChange={handleChange} required className={`${inputClass} pl-11`} />
                      </div>
                    </div>
                    <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className={inputClass} />
                    <textarea name="message" placeholder="Your Message..." value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} />

                    {error && (
                      <div className="p-3 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">{error}</div>
                    )}

                    <Magnet strength={0.15}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-5 h-5" /> Send Message</>
                        )}
                      </button>
                    </Magnet>
                  </form>
                )}
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
