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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Legal Consultation Request - ${formData.service}`);
    const body = encodeURIComponent(
      `Full Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Needed: ${formData.service}

Message:
${formData.message}`
    );

    window.location.href = `mailto:${firmContact.email}?subject=${subject}&body=${body}`;
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

            <button type="submit" className="btn btn-gold full-width">
              Send Consultation Request
            </button>

            <p className="form-note">
              By submitting this form, your email application will open with your consultation request prepared for sending.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
