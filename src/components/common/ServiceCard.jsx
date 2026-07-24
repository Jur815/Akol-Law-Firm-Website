export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <ul aria-label={`${service.title} includes`}>
        {service.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}
