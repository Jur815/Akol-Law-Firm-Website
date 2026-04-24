import { Link } from "react-router-dom";
import logo from "../../assets/akol-logo.jpeg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />

      <div className="container hero-grid">
        <div className="hero-content">
          <p className="hero-badge">Premier Multi-Disciplinary Law Firm</p>

          <h1>
            Strategic Legal Excellence in <span>South Sudan</span>
          </h1>

          <p className="hero-description">
            Akol For Legal Services bridges complex legal frameworks with practical business solutions, helping clients navigate regulatory landscapes with confidence, integrity, and strategic clarity.
          </p>

          <div className="hero-actions">
            <Link to="/contact" className="btn btn-gold">
              Request Consultation
            </Link>

            <Link to="/services" className="btn btn-outline">
              View Practice Areas
            </Link>
          </div>
        </div>

        <div className="hero-card-wrap">
          <div className="hero-card">
            <div className="hero-card-inner">
              <div className="hero-card-brand">
                <img src={logo} alt="Akol For Legal Services logo" />
                <div>
                  <h2>Akol For Legal Services</h2>
                  <p>Justice. Integrity. Strategy.</p>
                </div>
              </div>

              <div className="hero-mini-grid">
                <div className="mini-card">
                  <p className="mini-label">Vision</p>
                  <p>To be the regional benchmark for legal excellence and corporate integrity.</p>
                </div>
                <div className="mini-card">
                  <p className="mini-label">Approach</p>
                  <p>Strategic counsel backed by practical business understanding and robust representation.</p>
                </div>
              </div>

              <div className="promise-card">
                <p>Core Promise</p>
                <h3>Helping clients navigate legal complexity with confidence, compliance, and clarity.</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
