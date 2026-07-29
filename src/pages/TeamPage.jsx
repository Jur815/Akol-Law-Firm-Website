import SectionHeading from "../components/common/SectionHeading";
import Seo from "../components/common/Seo";
import { team } from "../data/siteData";
import { Link } from "react-router-dom";

export default function TeamPage() {
  return (
    <section className="section page-section">
      <Seo
        title="Marco Akol Deng | Founder & CEO | Akol For Legal Services"
        description="Learn about Marco Akol Deng, Founder and CEO of Akol For Legal Services, Advocate and Commissioner for Oaths, and an experienced sports governance leader in South Sudan."
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
              className={member.qualifications ? "team-card featured-profile-card" : "team-card"}
            >
              {member.qualifications ? (
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
  return (
    <>
      <div className="profile-header">
        <div className="profile-portrait" aria-hidden="true">
          MAD
        </div>
        <div className="profile-header-copy">
          <p className="eyebrow">Executive Profile</p>
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
          <section className="profile-section-block" aria-labelledby="marco-biography">
            <h4 id="marco-biography">Biography</h4>
            <div className="profile-copy">
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="profile-section-block" aria-labelledby="marco-leadership">
            <h4 id="marco-leadership">Leadership and Sports Administration</h4>
            <ol className="profile-timeline">
              {member.leadership.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" />
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="profile-aside" aria-label={`${member.name} professional details`}>
          <section className="profile-section-block" aria-labelledby="marco-qualifications">
            <h4 id="marco-qualifications">Professional Qualifications</h4>
            <div className="qualification-grid">
              {member.qualifications.map((item) => (
                <div key={item} className="qualification-card">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section-block" aria-labelledby="marco-expertise">
            <h4 id="marco-expertise">Areas of Expertise</h4>
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
