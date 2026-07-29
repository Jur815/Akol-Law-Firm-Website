import SectionHeading from "../components/common/SectionHeading";
import Seo from "../components/common/Seo";
import { team } from "../data/siteData";

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
              <div className="avatar">👤</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              {member.credentials ? (
                <p className="team-credentials">{member.credentials}</p>
              ) : null}
              {Array.isArray(member.bio) ? (
                <div className="profile-copy">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p>{member.bio}</p>
              )}
              {member.qualifications ? (
                <ProfileSection
                  title="Professional Qualifications"
                  items={member.qualifications}
                />
              ) : null}
              {member.leadership ? (
                <ProfileSection
                  title="Leadership and Sports Administration"
                  items={member.leadership}
                />
              ) : null}
              {member.expertise ? (
                <div className="profile-section">
                  <h4>Areas of Expertise</h4>
                  <div className="pill-wrap compact-pills">
                    {member.expertise.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ title, items }) {
  return (
    <div className="profile-section">
      <h4>{title}</h4>
      <ul className="profile-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
