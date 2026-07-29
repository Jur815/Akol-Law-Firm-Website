import SectionHeading from "../components/common/SectionHeading";
import Seo from "../components/common/Seo";
import { strengths } from "../data/siteData";

export default function AboutPage() {
  return (
    <section className="section page-section">
      <Seo
        title="About Akol For Legal Services | Legal Counsel in South Sudan"
        description="Learn about Akol For Legal Services, a South Sudan law firm focused on strategic legal counsel, integrity, compliance, and practical business solutions."
        path="/about"
      />
      <div className="container">
        <SectionHeading
          eyebrow="About The Firm"
          title="A premier law firm focused on strategy, integrity, and results"
          description="Akol For Legal Services (ALS) provides strategic legal counsel and robust representation designed to meet the realities of modern business, regulation, and dispute resolution in South Sudan."
          as="h1"
        />

        <div className="two-column cards-top">
          <div className="glass-card">
            <h3>Who We Are</h3>
            <p>
              We bridge the gap between complex legal frameworks and practical business solutions, ensuring that our clients navigate the regulatory landscape with confidence and clarity.
            </p>
            <p>
              ALS combines legal discipline with commercial awareness, helping individuals, institutions, and businesses make sound decisions in complex environments.
            </p>
          </div>

          <div className="glass-card">
            <h3>Our Vision</h3>
            <p>
              To be the regional benchmark for legal excellence, recognized for unwavering commitment to justice, corporate integrity, and the socio-economic development of the markets we serve.
            </p>
          </div>
        </div>

        <div className="glass-card cards-top">
          <h3>Why Clients Choose ALS</h3>
          <div className="strength-grid">
            {strengths.map((item) => (
              <div key={item} className="strength-box">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
