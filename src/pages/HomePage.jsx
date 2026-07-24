import logo from "../assets/akol-logo.jpeg";
import LinkButton from "../components/common/LinkButton";
import ServiceCard from "../components/common/ServiceCard";
import SectionHeading from "../components/common/SectionHeading";
import { contact, services, values } from "../data/siteData";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">South Sudan Law Firm</p>
            <h1>Akol For Legal Services</h1>
            <p className="lead">
              Strategic legal support for individuals, companies, and
              institutions that need clear advice, disciplined advocacy, and
              practical results.
            </p>
            <div className="hero-actions">
              <LinkButton href="/contact" className="button button-primary">
                Request Consultation
              </LinkButton>
              <LinkButton href="/services" className="button button-secondary">
                View Services
              </LinkButton>
            </div>
            <div className="stat-grid" aria-label="Firm highlights">
              <div className="stat">
                <strong>ALS</strong>
                <span>Client-focused legal services</span>
              </div>
              <div className="stat">
                <strong>Juba</strong>
                <span>Serving clients in South Sudan</span>
              </div>
              <div className="stat">
                <strong>Secure</strong>
                <span>Confidential matter intake</span>
              </div>
            </div>
          </div>
          <aside className="hero-card" aria-label="Akol For Legal Services contact summary">
            <img
              className="logo-display"
              src={logo}
              alt="Akol For Legal Services round firm logo"
              width="438"
              height="438"
              fetchPriority="high"
            />
            <h2>Talk to a lawyer</h2>
            <p className="lead">
              Share your matter through the secure contact form or reach the
              office directly.
            </p>
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
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Practice Areas"
            title="Legal support built around real decisions"
            description="ALS advises on commercial, civil, regulatory, property, employment, and private client matters."
          />
          <div className="service-grid">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How We Work"
            title="Responsive, careful, and practical"
            description="Clients need advice they can understand, trust, and use. The firm focuses on communication, preparation, and sound legal judgment."
          />
          <div className="card-grid">
            {values.map((value) => (
              <article className="card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
