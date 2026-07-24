import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "../../assets/akol-logo.jpeg";
import { firmContact } from "../../data/siteData";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <img src={logo} alt="ALS logo" className="brand-logo" />
            <div>
              <p className="brand-title">ALS</p>
              <p className="brand-subtitle">Akol For Legal Services</p>
            </div>
          </div>
          <p className="footer-text">
            Strategic legal counsel and robust representation for clients seeking confidence, compliance, and integrity in South Sudan.
          </p>
        </div>

        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/services">Practice Areas</Link>
            <Link to="/team">Team</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="footer-heading">Contact</h3>
          <div className="footer-contact">
            <div><MapPin size={16} /> {firmContact.location}</div>
            <a href={`mailto:${firmContact.email}`}><Mail size={16} /> {firmContact.email}</a>
            <a href={`tel:${firmContact.phone}`}><Phone size={16} /> {firmContact.phone}</a>
            <a
              href={`https://wa.me/${firmContact.whatsapp}?text=${encodeURIComponent(
                firmContact.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} /> {firmContact.whatsappDisplay}
            </a>
            <p>{firmContact.workingHours}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Akol For Legal Services (ALS). All rights reserved.
      </div>
    </footer>
  );
}
