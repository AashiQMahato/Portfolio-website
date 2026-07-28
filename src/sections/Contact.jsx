import { useState } from "react";
import { ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import { CV } from "../data/portfolioData";
import { Reveal } from "../motion";
import {
  FrameLabel,
  SelectionBox,
  PillButton,
  ClockBadge,
} from "../components/canvas";
import NothingButton from "./NothingButton";

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
    "w-full rounded-xl border border-line bg-background/60 px-4 py-3 text-sm text-ink placeholder:text-ink-dim/50 transition-colors focus:border-signal focus:outline-none focus:ring-0";

  return (
    <section
      id="contact"
      data-section
      aria-labelledby="contact-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <FrameLabel index="07" name="contact.fig" />
          <h2
            id="contact-heading"
            className="mt-8 font-display text-display-2 uppercase text-ink"
          >
            Still building
            <span className="text-signal">.</span>
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <ClockBadge />
            <p className="max-w-xl text-lg text-ink-dim">
              The best ideas always seem to land about now. Freelance,
              full-time, or a hardware idea that needs software — I respond
              within 24 hours.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* Channel card */}
          <Reveal className="lg:col-span-5">
            <div className="panel overflow-hidden rounded-3xl">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-signal" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-ember" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden="true" />
                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                  reach-me.frame
                </span>
              </div>
              <dl className="space-y-5 p-6 font-mono text-[13px]">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${CV.contact.email}`}
                      className="break-all text-accent-ink underline-offset-4 hover:underline"
                    >
                      {CV.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    Phone
                  </dt>
                  <dd className="mt-1 text-ink">{CV.contact.phone}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    Base
                  </dt>
                  <dd className="mt-1 text-ink">Kathmandu, Nepal · UTC+5:45</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    Status
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-ink">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                    open to freelance &amp; full-time
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    Elsewhere
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill flex items-center gap-1 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-ink-dim transition-colors hover:border-signal hover:text-accent-ink"
                      >
                        {social.label}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* Form in a selection frame */}
          <Reveal className="lg:col-span-7" y={36}>
            <SelectionBox
              name="say-hello.fig"
              note="zero hoops"
              tone="accent"
              className="panel rounded-3xl border-solid p-6 md:p-8"
            >
              {submitted ? (
                <div
                  role="status"
                  className="flex h-full min-h-[280px] flex-col items-center justify-center text-center"
                >
                  <CheckCircle className="mb-4 h-10 w-10 text-signal" aria-hidden="true" />
                  <p className="font-display text-xl font-bold text-ink">
                    Message sent.
                  </p>
                  <p className="mt-2 text-sm text-ink-dim">
                    Thanks for reaching out — I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                    {FIELDS.map((field) => (
                      <div
                        key={field.name}
                        className={field.name === "subject" ? "md:col-span-2" : ""}
                      >
                        <label
                          htmlFor={`contact-${field.name}`}
                          className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim"
                        >
                          {field.label} <span className="text-accent-ink">*</span>
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
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim"
                      >
                        Message <span className="text-accent-ink">*</span>
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
                    <p
                      role="alert"
                      className="rounded-xl border border-ember/40 bg-ember/5 px-4 py-3 text-sm text-ember"
                    >
                      {error}
                    </p>
                  ) : null}

                  <PillButton type="submit" disabled={isSubmitting} className="disabled:pointer-events-none disabled:opacity-50">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>Send message →</>
                    )}
                  </PillButton>
                </form>
              )}
            </SelectionBox>
          </Reveal>
        </div>

        <NothingButton />
      </div>
    </section>
  );
};

export default Contact;
