import { Link } from "react-router-dom";
import SectionHeading from "../components/common/SectionHeading";
import { practiceAreas } from "../data/siteData";

export default function ServicesPage() {
  return (
    <section className="section page-section">
      <div className="container">
        <SectionHeading
          eyebrow="Practice Areas"
          title="Specialized legal services tailored to client realities"
          description="ALS provides practical and strategic legal support across multiple sectors and high-value matters."
          as="h1"
        />

        <div className="service-detail-list">
          {practiceAreas.map((service) => {
            const Icon = service.icon;

            return (
              <div id={service.slug} key={service.slug} className="service-detail-card">
                <div className="service-detail-content">
                  <div className="icon-box large-icon">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.full}</p>
                  </div>
                </div>

                <Link to="/contact" className="btn btn-soft">
                  Request Consultation
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
