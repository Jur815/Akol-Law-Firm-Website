export default function SectionHeading({
  eyebrow,
  title,
  description,
  headingLevel = "h2",
}) {
  const HeadingTag = headingLevel;

  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <HeadingTag>{title}</HeadingTag>
      {description ? <p className="lead">{description}</p> : null}
    </div>
  );
}
