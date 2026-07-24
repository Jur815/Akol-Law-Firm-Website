import { contact, navLinks } from "../../data/siteData";
import LinkButton from "../common/LinkButton";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2>Akol For Legal Services</h2>
            <p>
              Trusted legal advice and disciplined representation for clients in
              South Sudan.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              {navLinks.map((link) => (
                <LinkButton key={link.href} href={link.href}>
                  {link.label}
                </LinkButton>
              ))}
            </div>
          </div>
          <address>
            <h3>Contact</h3>
            <div className="footer-links">
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: {contact.whatsappDisplay}
              </a>
              <span>{contact.address}</span>
            </div>
          </address>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Akol For Legal Services. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
