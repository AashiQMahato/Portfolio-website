import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  User,
  AtSign,
  MessageCircle,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { ScrollReveal, SectionHeader, GlassCard, Magnet } from "./ui";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  "18a22bbb-2e79-4455-b38e-193a751289de";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "+977-9808711811",
    color: "text-primary-400",
    bg: "bg-primary-500/10",
  },
  {
    icon: Mail,
    title: "Email",
    content: "aashikkrmahatoo@gmail.com",
    color: "text-secondary-400",
    bg: "bg-secondary-500/10",
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Kathmandu, Nepal",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
  },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/AashiQMahato", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/aashiq__mahato/",
    label: "Instagram",
  },
];

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });

  const formatWeb3FormsError = (err) => {
    const message = err?.message;
    const apiMessage = err?.apiMessage;

    // Common browser/network failure (CORS, adblock, offline)
    if (message && /fetch|network|cors/i.test(message)) {
      return "Network/CORS error while submitting the form. Check your connection or browser extensions.";
    }

    if (apiMessage) return apiMessage;
    if (message) return message;
    return "Failed to send message. Please try again.";
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (!WEB3FORMS_ACCESS_KEY) {
        throw new Error("Web3Forms access key is not configured.");
      }

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.user_name,
        email: formData.user_email,
        subject: formData.subject,
        message: formData.message,

        // Optional fields Web3Forms will include in the email
        from_name: formData.user_name,
        replyto: formData.user_email,
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const apiMessage =
          data?.message ||
          `Submission failed (${res.status}). Please try again later.`;
        const err = new Error(apiMessage);
        err.apiMessage = apiMessage;
        throw err;
      }

      if (!data?.success) {
        const apiMessage =
          data?.message || "Submission failed. Please try again.";
        const err = new Error(apiMessage);
        err.apiMessage = apiMessage;
        throw err;
      }

      setFormData({ user_name: "", user_email: "", subject: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError(formatWeb3FormsError(err));
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm rounded-xl bg-card/60 border border-border text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-primary/40";

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-72 h-72 bg-primary/8 blur opacity-60" />
        <div className="absolute rounded-full opacity-50 -bottom-40 -left-40 w-72 h-72 bg-primary/8 blur" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="Contact"
            title={
              <>
                Get In <span className="gradient-text">Touch</span>
              </>
            }
            description="Ready to bring your ideas to life? Let’s discuss your next project."
          />

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Left Column - Info */}
            <ScrollReveal direction="left" className="space-y-6 lg:col-span-2">
              {/* Contact Cards */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="mb-5 text-lg font-semibold font-display">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${item.bg}`}>
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Social Links */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="mb-5 text-lg font-semibold font-display">
                  Connect With Me
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Magnet key={social.label} strength={0.2}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center transition-colors duration-200 border w-11 h-11 rounded-xl border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-primary hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          title={social.label}>
                          <Icon className="w-5 h-5" />
                        </a>
                      </Magnet>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Available Badge */}
              <div className="p-5 text-center border shadow-sm rounded-xl border-border bg-card/60 backdrop-blur">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="relative flex w-3 h-3">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                    <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-emerald-400">
                    Currently Available
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Open to freelance & full-time opportunities
                </p>
              </div>
            </ScrollReveal>

            {/* Right Column - Form */}
            <ScrollReveal direction="right" className="lg:col-span-3">
              <GlassCard className="p-6 lg:p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl border border-primary/25 bg-primary/10">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display">
                      Send Message
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      I’ll respond within 24 hours
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 text-center border rounded-xl bg-emerald-500/10 border-emerald-500/20">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                    <h4 className="mb-1 text-lg font-semibold text-emerald-400">
                      Message Sent!
                    </h4>
                    <p className="text-sm text-emerald-300/70">
                      Thanks for reaching out. I’ll get back to you soon!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="relative">
                        <User className="absolute w-4 h-4 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          name="user_name"
                          placeholder="Your Name"
                          value={formData.user_name}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                      <div className="relative">
                        <AtSign className="absolute w-4 h-4 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          name="user_email"
                          placeholder="Your Email"
                          value={formData.user_email}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                    <textarea
                      name="message"
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />

                    {error && (
                      <div className="p-3 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
                        {error}
                      </div>
                    )}

                    <Magnet strength={0.15}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center h-11 gap-2 px-6 rounded-xl font-semibold bg-primary text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-60 disabled:pointer-events-none transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />{" "}
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" /> Send Message
                          </>
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
