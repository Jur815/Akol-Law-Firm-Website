import SectionHeading from "../components/common/SectionHeading";
import { team } from "../data/siteData";

export default function TeamPage() {
  return (
    <section className="section page-section">
      <div className="container">
        <SectionHeading
          eyebrow="Our Team"
          title="A legal team built on trust, strategy, and discipline"
          description="Presenting leadership and legal capability clearly online helps build confidence before the first consultation."
        />

        <div className="cards-grid">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div className="avatar">👤</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
