import SectionHeading from "../components/common/SectionHeading";
import { team } from "../data/siteData";

export default function TeamPage() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Our Team"
          title="A legal team built on trust, strategy, and discipline"
          description="ALS brings focused legal capability to client matters through advisory, compliance, and dispute resolution work."
          headingLevel="h1"
        />

        <div className="team-grid">
          {team.map((member) => (
            <article key={member.name} className="team-card">
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p>{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
