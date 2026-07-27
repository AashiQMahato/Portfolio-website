import { useState } from "react";
import { ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import { CV } from "../data/portfolioData";
import SectionHeading from "../components/schematic/SectionHeading";
import { Magnetic, Reveal } from "../motion";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  "18a22bbb-2e79-4455-b38e-193a751289de";

const SOCIALS = [
  { label: "GitHub", href: CV.contact.github },
  { label: "LinkedIn", href: CV.contact.linkedin },
  { label: "Instagram", href: "https://www.instagram.com/aashiq__mahato/" },
];

const FIELDS = [
  { name: "user_name", label: "Name", type: "text", autoComplete: "name" },
  { name: "user_email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

const formatWeb3FormsError = (err) => {
  const message = err?.message;
  if (message && /fetch|network|cors/i.test(message)) {
    return "Network error while submitting the form. Check your connection or browser extensions.";
  }
  return err?.apiMessage || message || "Failed to send message. Please try again.";
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });

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
        from_name: formData.user_name,
        replyto: formData.user_email,
      };
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        const apiMessage =
          data?.message || `Submission failed (${res.status}). Please try again.`;
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
    "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-sm text-ink placeholder:text-ink-dim/50 transition-colors focus:border-signal focus:outline-none focus:ring-0";

  return (
    <section
      id="contact"
      data-section
      aria-labelledby="contact-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10 lg:pl-28 lg:pr-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="Contact"
          title={<span id="contact-heading">Open a connection<span className="text-signal">.</span></span>}
          blurb="Freelance, full-time, or a hardware idea that needs software — I respond within 24 hours."
        />

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Terminal card */}
          <Reveal className="lg:col-span-5">
            <div className="border border-line bg-panel/60">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-line" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-line" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-signal/70" aria-hidden="true" />
                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                  contact.sh
                </span>
              </div>
              <div className="space-y-4 p-5 font-mono text-xs leading-relaxed md:text-[13px]">
                <p className="text-ink-dim">
                  <span className="text-signal">$</span> contact --list
                </p>
                <dl className="space-y-2.5 pl-4">
                  <div className="flex flex-wrap gap-x-4">
                    <dt className="w-20 uppercase tracking-[0.15em] text-ink-dim">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${CV.contact.email}`}
                        className="text-ink underline-offset-4 hover:text-signal hover:underline"
                      >
                        {CV.contact.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-4">
                    <dt className="w-20 uppercase tracking-[0.15em] text-ink-dim">Phone</dt>
                    <dd className="text-ink">{CV.contact.phone}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-4">
                    <dt className="w-20 uppercase tracking-[0.15em] text-ink-dim">Base</dt>
                    <dd className="text-ink">Kathmandu, Nepal · UTC+5:45</dd>
                  </div>
                </dl>
                <p className="text-ink-dim">
                  <span className="text-signal">$</span> status
                </p>
                <p className="pl-4 text-ink">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle" aria-hidden="true" />
                  open to freelance &amp; full-time — response &lt; 24h
                </p>
                <p className="text-ink-dim">
                  <span className="text-signal">$</span> links
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 pl-4">
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 uppercase tracking-[0.15em] text-ink-dim transition-colors hover:text-signal"
                      >
                        {social.label}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-7" y={36}>
            {submitted ? (
              <div
                role="status"
                className="flex h-full min-h-[280px] flex-col items-center justify-center border border-signal/40 bg-signal/5 p-10 text-center"
              >
                <CheckCircle className="mb-4 h-10 w-10 text-signal" aria-hidden="true" />
                <p className="font-display text-xl font-semibold text-ink">Message sent.</p>
                <p className="mt-2 text-sm text-ink-dim">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                  {FIELDS.map((field) => (
                    <div key={field.name} className={field.name === "subject" ? "md:col-span-2" : ""}>
                      <label
                        htmlFor={`contact-${field.name}`}
                        className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim"
                      >
                        {field.label} <span className="text-signal">*</span>
                      </label>
                      <input
                        id={`contact-${field.name}`}
                        type={field.type}
                        name={field.name}
                        autoComplete={field.autoComplete}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim"
                    >
                      Message <span className="text-signal">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="border border-ember/40 bg-ember/5 px-4 py-3 text-sm text-ember">
                    {error}
                  </p>
                ) : null}

                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 items-center gap-3 border border-signal px-8 font-mono text-xs uppercase tracking-[0.25em] text-signal transition-colors hover:bg-signal hover:text-background disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Transmitting…
                      </>
                    ) : (
                      <>Send message →</>
                    )}
                  </button>
                </Magnetic>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
