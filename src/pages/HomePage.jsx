import Hero from "../components/home/Hero";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/common/ServiceCard";
import { industries, practiceAreas, strengths } from "../data/siteData";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section">
        <div className="container two-column">
          <div>
            <SectionHeading
              eyebrow="About ALS"
              title="Legal counsel shaped for complex realities"
              description="ALS is a premier multi-disciplinary law firm dedicated to delivering strategic legal counsel and robust representation across South Sudan. We translate complex legal frameworks into actionable solutions for corporations, institutions, and individuals."
            />
            <p className="body-large">
              Our mission is to help clients operate with confidence, remain protected, and make informed decisions that support long-term success.
            </p>
          </div>

          <div className="stack">
            <div className="glass-card">
              <p className="eyebrow">Our Vision</p>
              <p className="card-text">
                To be the regional benchmark for legal excellence, recognized for unwavering commitment to justice, corporate integrity, and the socio-economic development of the markets we serve.
              </p>
            </div>

            <div className="glass-card">
              <p className="eyebrow">Why Clients Choose ALS</p>
              <div className="strength-list">
                {strengths.slice(0, 4).map((item) => (
                  <div key={item} className="strength-item">
                    <span>✓</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Practice Areas"
            title="Legal services built around modern business realities"
            description="From infrastructure and aviation to employment, commercial disputes, and corporate risk, ALS delivers strategic legal support that protects client interests and strengthens decision-making."
          />

          <div className="cards-grid">
            {practiceAreas.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div>
            <SectionHeading
              eyebrow="Industries Served"
              title="Sector insight that strengthens legal strategy"
              description="ALS supports organizations operating in highly regulated and fast-moving sectors, offering legal insight that is both commercially aware and context-sensitive."
            />

            <div className="pill-wrap">
              {industries.map((industry) => (
                <span key={industry} className="pill">
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card large-card">
            <p className="eyebrow">Case Highlights</p>
            <div className="stack">
              <div className="dark-card">
                <h3>Infrastructure Compliance Advisory</h3>
                <p>Advised on legal and regulatory considerations surrounding project structure, land use, and compliance requirements.</p>
              </div>
              <div className="dark-card">
                <h3>Commercial Dispute Strategy</h3>
                <p>Supported dispute positioning and resolution planning for commercial parties seeking effective legal remedies.</p>
              </div>
              <div className="dark-card">
                <h3>Corporate Risk Structuring</h3>
                <p>Developed legal risk approaches tailored to business operations, governance exposure, and asset protection needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
