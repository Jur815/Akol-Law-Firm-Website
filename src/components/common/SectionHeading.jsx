export default function SectionHeading({ eyebrow, title, description, as: Heading = "h2" }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <Heading>{title}</Heading>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
