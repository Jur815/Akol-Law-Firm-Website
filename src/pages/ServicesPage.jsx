import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/common/ServiceCard";
import LinkButton from "../components/common/LinkButton";
import { services } from "../data/siteData";

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Services"
          title="Practice areas"
          description="From business formation to dispute strategy, ALS helps clients understand their options and move forward with care."
          headingLevel="h1"
        />
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
        <div className="button-row">
          <LinkButton href="/contact" className="button button-primary">
            Start a Matter
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
