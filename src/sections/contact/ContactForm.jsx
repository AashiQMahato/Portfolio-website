import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { MagneticButton } from "../../components/ui";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "18a22bbb-2e79-4455-b38e-193a751289de";

const FIELDS = [
  { name: "user_name", label: "Name", type: "text", autoComplete: "name" },
  { name: "user_email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
];

const EMPTY = { user_name: "", user_email: "", subject: "", message: "" };

const formatError = (err) => {
  const message = err?.message;
  if (message && /fetch|network|cors/i.test(message)) {
    return "Network error while sending. Check your connection or browser extensions.";
  }
  return err?.apiMessage || message || "Couldn't send the message. Please try again.";
};

/**
 * Short note form (Web3Forms). Underlined fields with floating-free labels,
 * native validation, and inline status: sending → sent / error, announced
 * through a live region rather than a toast.
 */
const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
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
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setError(formatError(err));
      setStatus("error");
    }
  };

  const field =
    "peer w-full border-0 border-b border-line bg-transparent px-0 pb-3 pt-2 text-lg text-ink placeholder:text-ink-dim/70 transition-colors duration-300 focus:border-signal focus:outline-none focus:ring-0";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name} className={f.name === "subject" ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="hud block">
              {f.label}
              {f.name !== "subject" && <span className="text-accent-ink"> *</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.name !== "subject"}
              value={form[f.name]}
              onChange={onChange}
              className={field}
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="hud block">
          Message <span className="text-accent-ink">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          data-lenis-prevent
          value={form.message}
          onChange={onChange}
          className={`${field} resize-none`}
        />
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
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
