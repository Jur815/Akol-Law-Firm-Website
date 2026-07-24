import { navigateTo } from "../../utils/router";

export default function LinkButton({ href, children, className = "" }) {
  function handleClick(event) {
    if (href.startsWith("/")) {
      event.preventDefault();
      navigateTo(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
