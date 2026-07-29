import { Link } from "react-router-dom";
import SectionHeading from "../components/common/SectionHeading";
import Seo from "../components/common/Seo";
import { practiceAreas } from "../data/siteData";

export default function ServicesPage() {
  return (
    <section className="section page-section">
      <Seo
        title="Sports Law and Legal Services | Akol For Legal Services"
        description="Explore Akol For Legal Services practice areas, including Sports Law and Governance support for federations, clubs, athletes, administrators, and organisations in South Sudan."
        path="/services"
      />
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
                    {service.services ? (
                      <ul className="service-feature-list">
                        {service.services.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
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
