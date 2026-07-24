import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import { contact } from "../data/siteData";
import {
  contactFieldLimits,
  validateContactPayload,
} from "../utils/contactValidation";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  company: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSending, setIsSending] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.type !== "idle") {
      setStatus({ type: "idle", message: "" });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSending) return;

    const validation = validateContactPayload(form);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields before sending.",
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.values),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result?.errors) {
          setErrors(result.errors);
        }
        throw new Error(result?.message || "Your message could not be sent.");
      }

      setForm(initialForm);
      setErrors({});
      setStatus({
        type: "success",
        message: "Thank you. Your message has been sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="section">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Start with a confidential message"
            description="Send a short description of your matter and the firm will review it before responding. Please do not include highly sensitive details until an engagement is confirmed."
            headingLevel="h1"
          />
          <div className="contact-list">
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: {contact.whatsappDisplay}
            </a>
            <span>{contact.address}</span>
            <span>{contact.hours}</span>
          </div>
        </div>

        <form className="panel form" onSubmit={handleSubmit} noValidate>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={updateField}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={updateField}
              maxLength={contactFieldLimits.name}
              autoComplete="name"
              disabled={isSending}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name ? (
              <span className="field-error" id="name-error">
                {errors.name}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              maxLength={contactFieldLimits.email}
              autoComplete="email"
              disabled={isSending}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email ? (
              <span className="field-error" id="email-error">
                {errors.email}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              maxLength={contactFieldLimits.phone}
              autoComplete="tel"
              disabled={isSending}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              required
            />
            {errors.phone ? (
              <span className="field-error" id="phone-error">
                {errors.phone}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={updateField}
              maxLength={contactFieldLimits.subject}
              disabled={isSending}
              aria-invalid={errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              required
            />
            {errors.subject ? (
              <span className="field-error" id="subject-error">
                {errors.subject}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={updateField}
              maxLength={contactFieldLimits.message}
              disabled={isSending}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message ? (
              <span className="field-error" id="message-error">
                {errors.message}
              </span>
            ) : null}
          </div>

          {status.type !== "idle" ? (
            <div
              className={`status status-${status.type}`}
              role={status.type === "error" ? "alert" : "status"}
            >
              {status.message}
            </div>
          ) : null}

          <button
            className="button button-primary"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
