import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import { firmContact, practiceAreas } from "../data/siteData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: practiceAreas[0].title,
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    type: "idle",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ type: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Legal Consultation Request - ${formData.service}`,
          message: formData.message,
          company: "",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your request right now.");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: practiceAreas[0].title,
        message: "",
      });
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Needed</label>
              <select name="service" value={formData.service} onChange={handleChange}>
                {practiceAreas.map((item) => (
                  <option key={item.slug}>{item.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your legal matter"
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold full-width"
              disabled={formStatus.type === "loading"}
            >
              {formStatus.type === "loading" ? "Sending..." : "Send Consultation Request"}
            </button>

            {formStatus.message ? (
              <p className={`form-note form-note-${formStatus.type}`} role="status">
                {formStatus.message}
              </p>
            ) : null}

            <p className="form-note">
              By submitting this form, your consultation request will be sent securely to our legal team.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
