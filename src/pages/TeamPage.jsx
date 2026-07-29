import SectionHeading from "../components/common/SectionHeading";
import Seo from "../components/common/Seo";
import { team } from "../data/siteData";
import { Link } from "react-router-dom";

export default function TeamPage() {
  return (
    <section className="section page-section">
      <Seo
        title="Marco Akol Deng | Founder & CEO | Akol For Legal Services"
        description="Learn about Akol For Legal Services team members, including Marco Akol Deng, Founder and CEO, and Marco Ajou Aleu, Office Manager and Legal Clerk."
        path="/team"
      />
      <div className="container">
        <SectionHeading
          eyebrow="Our Team"
          title="A legal team built on trust, strategy, and discipline"
          description="Presenting leadership and legal capability clearly online helps build confidence before the first consultation."
          as="h1"
        />

        <div className="cards-grid">
          {team.map((member) => (
            <div
              key={member.name}
              id={member.slug}
              className={hasDetailedProfile(member) ? "team-card featured-profile-card" : "team-card"}
            >
              {hasDetailedProfile(member) ? (
                <ExecutiveProfile member={member} />
              ) : (
                <>
                  <div className="avatar" aria-hidden="true">
                    👤
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p>{member.bio}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExecutiveProfile({ member }) {
  const biographyId = `${member.slug}-biography`;
  const summaryId = `${member.slug}-summary`;
  const leadershipId = `${member.slug}-leadership`;
  const responsibilitiesId = `${member.slug}-responsibilities`;
  const qualificationsExperienceId = `${member.slug}-qualifications-experience`;
  const qualificationsId = `${member.slug}-qualifications`;
  const expertiseId = `${member.slug}-expertise`;

  return (
    <>
      <div className="profile-header">
        <div className="profile-portrait" aria-hidden="true">
          {member.initials || getInitials(member.name)}
        </div>
        <div className="profile-header-copy">
          <p className="eyebrow">{member.profileLabel || "Executive Profile"}</p>
          <h3>{member.name}</h3>
          <p className="team-role">{member.role}</p>
          <p className="team-credentials">{member.credentials}</p>
          <div className="profile-actions">
            <Link to="/contact" className="btn btn-gold">
              Book Consultation
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact the Firm
            </Link>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <section className="profile-section-block" aria-labelledby={biographyId}>
            <h4 id={biographyId}>Biography</h4>
            <div className="profile-copy">
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          {member.summary ? (
            <section className="profile-section-block" aria-labelledby={summaryId}>
              <h4 id={summaryId}>Professional Summary</h4>
              <div className="pill-wrap compact-pills">
                {member.summary.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {member.leadership ? (
            <section className="profile-section-block" aria-labelledby={leadershipId}>
              <h4 id={leadershipId}>Leadership and Sports Administration</h4>
              <ol className="profile-timeline">
                {member.leadership.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" />
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {member.responsibilities ? (
            <section className="profile-section-block" aria-labelledby={responsibilitiesId}>
              <h4 id={responsibilitiesId}>Key Responsibilities</h4>
              <div className="responsibility-grid">
                {member.responsibilities.map((group) => (
                  <div key={group.title} className="qualification-card">
                    <h5>{group.title}</h5>
                    <ul className="profile-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="profile-aside" aria-label={`${member.name} professional details`}>
          {member.qualificationsExperience ? (
            <section className="profile-section-block" aria-labelledby={qualificationsExperienceId}>
              <h4 id={qualificationsExperienceId}>Qualifications and Experience</h4>
              <div className="qualification-grid">
                {member.qualificationsExperience.map((item) => (
                  <div key={item} className="qualification-card">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {member.qualifications ? (
            <section className="profile-section-block" aria-labelledby={qualificationsId}>
              <h4 id={qualificationsId}>Professional Qualifications</h4>
              <div className="qualification-grid">
                {member.qualifications.map((item) => (
                  <div key={item} className="qualification-card">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="profile-section-block" aria-labelledby={expertiseId}>
            <h4 id={expertiseId}>
              {member.qualifications ? "Areas of Expertise" : "Areas of Administrative Expertise"}
            </h4>
            <div className="pill-wrap compact-pills">
              {member.expertise.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function hasDetailedProfile(member) {
  return Array.isArray(member.bio) && Array.isArray(member.expertise);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
