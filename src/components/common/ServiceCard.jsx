import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <div className="service-card">
      <div className="icon-box">
        <Icon size={28} />
      </div>

      <h3>{service.title}</h3>
      <p>{service.short}</p>

      <Link to={`/services#${service.slug}`} className="learn-link">
        Learn More <ChevronRight size={16} />
      </Link>
    </div>
  );
}
