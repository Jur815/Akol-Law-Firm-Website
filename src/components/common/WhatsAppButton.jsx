import { firmContact } from "../../data/siteData";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hello Akol For Legal Services, I would like to request a legal consultation."
  );

  const whatsappUrl = `https://wa.me/${firmContact.whatsapp}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-button"
      aria-label="Chat with Akol For Legal Services on WhatsApp"
    >
      <span>💬</span>
      <span className="whatsapp-text">WhatsApp</span>
    </a>
  );
}
