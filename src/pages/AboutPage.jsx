import SectionHeading from "../components/common/SectionHeading";
import { values } from "../data/siteData";

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="container split-grid">
          <SectionHeading
            eyebrow="About ALS"
            title="A trusted legal partner for important matters"
            description="Akol For Legal Services provides practical legal advice and representation for clients navigating South Sudan's commercial, regulatory, and civil legal landscape."
            headingLevel="h1"
          />
          <div className="panel form">
            <h3>Client commitment</h3>
            <p className="lead">
              The firm approaches each matter with confidentiality, careful
              listening, clear recommendations, and disciplined follow-through.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Values"
            title="What clients can expect"
            description="ALS combines local legal insight with steady communication and practical legal strategy."
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
