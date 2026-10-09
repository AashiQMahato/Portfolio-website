import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { MagneticButton } from "../../components/ui";
import { reactAvatar } from "../../components/avatar/mood";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "18a22bbb-2e79-4455-b38e-193a751289de";

const FIELDS = [
  { name: "user_name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { name: "user_email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off", placeholder: "What's it about? (optional)" },
];

/** Field-level checks; returns { field: message } for anything invalid. */
const validate = (f) => {
  const errors = {};
  if (!f.user_name.trim()) errors.user_name = "Please add your name.";
  if (!f.user_email.trim()) errors.user_email = "Please add an email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.user_email.trim())) errors.user_email = "That email doesn't look right.";
  if (!f.message.trim()) errors.message = "Please write a short message.";
  return errors;
};

const EMPTY = { user_name: "", user_email: "", subject: "", message: "" };

const formatError = (err) => {
  const message = err?.message;
  if (message && /fetch|network|cors/i.test(message)) {
    return "Network error while sending. Check your connection or browser extensions.";
  }
  return err?.apiMessage || message || "Couldn't send the message. Please try again.";
};

/**
 * Short note form (Web3Forms). Underlined fields, inline field errors
 * (aria-invalid + described-by, focus moves to the first problem), and an
 * inline status: sending → sent / error, announced through a live region.
 * "Sent" appears only after the service confirms delivery.
 */
const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    // Clear a field's error as soon as it's fixed (never add new ones while typing).
    if (errors[e.target.name] && !validate(next)[e.target.name]) {
      setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== e.target.name)));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("sending");
    reactAvatar("working", 15000);
    setError(null);
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.user_name,
          email: form.user_email,
          subject: form.subject,
          message: form.message,
          from_name: form.user_name,
          replyto: form.user_email,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        const apiMessage = data?.message || `Sending failed (${res.status}). Please try again.`;
        throw Object.assign(new Error(apiMessage), { apiMessage });
      }
      setForm(EMPTY);
      setStatus("sent");
      reactAvatar("celebrate", 5000);
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setError(formatError(err));
      setStatus("error");
      reactAvatar("sad", 4000);
    }
  };

  const field =
    "peer w-full border-0 border-b border-line bg-transparent px-0 pb-3 pt-2 text-lg text-ink placeholder:text-ink-dim/70 transition-colors duration-300 focus:border-signal focus:outline-none focus:ring-0";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name} className={f.name === "subject" ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="hud block">
              {f.label}
              {f.name !== "subject" && <span className="text-accent-ink"> *</span>}
            </label>
            <input
              data-avatar="listening"
              id={f.name}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.name !== "subject"}
              placeholder={f.placeholder}
              aria-invalid={errors[f.name] ? true : undefined}
              aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
              value={form[f.name]}
              onChange={onChange}
              className={`${field} ${errors[f.name] ? "border-accent-ink" : ""}`}
            />
            {errors[f.name] && (
              <p id={`${f.name}-error`} className="mt-2 text-sm text-accent-ink">
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="hud block">
          Message <span className="text-accent-ink">*</span>
        </label>
        <textarea
          data-avatar="listening"
          id="message"
          name="message"
          rows={4}
          required
          data-lenis-prevent
          placeholder="A few lines about the project or role…"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          value={form.message}
          onChange={onChange}
          className={`${field} resize-none ${errors.message ? "border-accent-ink" : ""}`}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-accent-ink">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <MagneticButton
          type="submit"
          variant="solid"
          disabled={status === "sending"}
          icon={status === "sending" ? Loader2 : status === "sent" ? Check : ArrowUpRight}
          className="disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send message"}
        </MagneticButton>
        <p role="status" aria-live="polite" className={`text-sm ${status === "error" ? "text-accent-ink" : "text-ink-dim"}`}>
          {status === "sent" && "Thanks — I'll reply within a day."}
          {status === "error" && (
            <>
              {error} You can also email{" "}
              <a href="mailto:aashikkrmahatoo@gmail.com" className="link-line text-ink">
                aashikkrmahatoo@gmail.com
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
