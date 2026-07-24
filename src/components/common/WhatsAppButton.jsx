import { firmContact } from "../../data/siteData";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${firmContact.whatsapp}?text=${encodeURIComponent(
    firmContact.whatsappMessage
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chat with Akol For Legal Services on WhatsApp"
    >
      <span>💬</span>
      <span className="whatsapp-text">WhatsApp</span>
    </a>
  );
}
