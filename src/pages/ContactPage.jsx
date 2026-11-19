import { useEffect, useRef, useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import { firmContact, practiceAreas } from "../data/siteData";
import { contactFieldLimits, validateContactPayload } from "../utils/contactValidation";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  service: practiceAreas[0].title,
  message: "",
};
const fieldOrder = Object.keys(initialFormData);
const honeypotName = "als_contact_website";

function retryMessage(retryAfter) {
  const seconds = retryAfter && /^\d+$/.test(retryAfter)
    ? Number(retryAfter)
    : Math.ceil((Date.parse(retryAfter) - Date.now()) / 1000);
  let wait = "in a few minutes";

  if (Number.isFinite(seconds) && seconds > 0) {
    if (seconds < 60) {
      wait = `in ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
    } else {
      const minutes = Math.ceil(seconds / 60);
      wait = `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }
  }

  return `Too many requests. Your entries are still in the form. Please try again ${wait}.`;
}

function FieldError({ name, error }) {
  return error ? (
    <p className="form-field-error" id={`contact-${name}-error`}>{error}</p>
  ) : null;
}

export default function ContactPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);
  const pendingFocus = useRef(null);
  const [formStatus, setFormStatus] = useState({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    if (pendingFocus.current) {
      formRef.current.elements.namedItem(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  }, [fieldErrors]);

  function showFieldErrors(errors) {
    const nextErrors = { ...errors, service: errors.subject };
    pendingFocus.current = fieldOrder.find((field) => nextErrors[field]);
    setFieldErrors(nextErrors);
  }

  function fieldAccessibility(name) {
    return fieldErrors[name]
      ? { "aria-invalid": true, "aria-describedby": `contact-${name}-error` }
      : {};
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formStatus.type !== "loading") {
      setFormStatus({ type: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formStatus.type === "loading") return;

    const honeypot = event.currentTarget.elements.namedItem(honeypotName);
    const { name, email, phone, service, message } = formData;
    const validation = validateContactPayload({
      name,
      email,
      phone,
      subject: `Legal Consultation Request - ${service}`,
      message,
      company: honeypot.value,
    });
    if (!validation.isValid) {
      showFieldErrors(validation.errors);
      setFormStatus({ type: "error", message: "Please correct the highlighted fields." });
      return;
    }

    setFieldErrors({});
    setFormStatus({
      type: "loading",
      message: "Sending your consultation request...",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.values),
      });

      if (response.status === 429) {
        throw new Error(retryMessage(response.headers.get("Retry-After")));
      }

      if (response.status === 202) {
        honeypot.value = "";
        throw new Error("Your request could not be sent. Please try again or contact the firm directly.");
      }

      const result = await response.json().catch(() => null);

      if (!response.ok || typeof result?.message !== "string") {
        if (result?.errors) showFieldErrors(result.errors);
        throw new Error(result?.message || "Unable to send your request right now.");
      }

      setFormData(initialFormData);
      setFormStatus({
        type: "success",
        message: "Your consultation request has been sent successfully.",
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your request right now.",
      });
    }
  };

  return (
    <section className="section page-section">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            eyebrow="Contact Us"
            title="Speak to a legal expert today"
            description="Whether you need corporate advisory, dispute support, labor law assistance, or sector-specific legal counsel, ALS is ready to support your next step."
            as="h1"
          />

          <div className="contact-info-list">
            <div className="contact-info-card">
              <p>Office Location</p>
              <h3>{firmContact.location}</h3>
            </div>

            <div className="contact-info-card">
              <p>Email</p>
              <a href={`mailto:${firmContact.email}`}>{firmContact.email}</a>
            </div>

            <div className="contact-info-card">
              <p>Phone</p>
              <a href={`tel:${firmContact.phone}`}>{firmContact.phone}</a>
            </div>

            <div className="contact-info-card">
              <p>WhatsApp</p>
              <a
                href={`https://wa.me/${firmContact.whatsapp}?text=${encodeURIComponent(
                  firmContact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {firmContact.whatsappDisplay}
              </a>
            </div>

            <div className="contact-info-card">
              <p>Working Hours</p>
              <h3>{firmContact.workingHours}</h3>
            </div>
          </div>
        </div>

        <div className="form-card">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={
              formStatus.message ? "contact-form-status contact-form-note" : "contact-form-note"
            }
          >
            <input type="text" name={honeypotName} autoComplete="off" tabIndex={-1} hidden />

            <div className="form-group">
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={contactFieldLimits.name}
                autoComplete="name"
                {...fieldAccessibility("name")}
                required
                placeholder="Enter your full name"
              />
              <FieldError name="name" error={fieldErrors.name} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={contactFieldLimits.email}
                  autoComplete="email"
                  {...fieldAccessibility("email")}
                  required
                  placeholder="Enter your email"
                />
                <FieldError name="email" error={fieldErrors.email} />
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone">Phone</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={contactFieldLimits.phone}
                  autoComplete="tel"
                  {...fieldAccessibility("phone")}
                  required
                  placeholder="Enter your phone"
                />
                <FieldError name="phone" error={fieldErrors.phone} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-service">Service Needed</label>
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                {...fieldAccessibility("service")}
              >
                {practiceAreas.map((item) => (
                  <option key={item.slug}>{item.title}</option>
                ))}
              </select>
              <FieldError name="service" error={fieldErrors.service} />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={contactFieldLimits.message}
                {...fieldAccessibility("message")}
                required
                placeholder="Tell us about your legal matter"
              />
              <FieldError name="message" error={fieldErrors.message} />
            </div>

            <button
              type="submit"
              className="btn btn-gold full-width"
              disabled={formStatus.type === "loading"}
              aria-disabled={formStatus.type === "loading"}
              aria-busy={formStatus.type === "loading"}
            >
              {formStatus.type === "loading" ? "Sending..." : "Send Consultation Request"}
            </button>

            {formStatus.message ? (
              <p
                id="contact-form-status"
                className={`form-note form-note-${formStatus.type}`}
                role={formStatus.type === "error" ? "alert" : "status"}
                aria-live={formStatus.type === "error" ? "assertive" : "polite"}
              >
                {formStatus.message}
              </p>
            ) : null}

            <p className="form-note" id="contact-form-note">
              By submitting this form, your consultation request will be sent securely to our legal team.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
