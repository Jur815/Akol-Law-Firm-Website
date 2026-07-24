import { useEffect, useState } from "react";
import logo from "../../assets/akol-logo.jpeg";
import { navLinks } from "../../data/siteData";
import { getCurrentPath, navigateTo } from "../../utils/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    function handleRouteChange() {
      setPath(getCurrentPath());
      setIsOpen(false);
    }

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("app:navigate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("app:navigate", handleRouteChange);
    };
  }, []);

  function handleNav(event, href) {
    event.preventDefault();
    navigateTo(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Primary navigation">
        <a className="brand" href="/" onClick={(event) => handleNav(event, "/")}>
          <img src={logo} alt="Akol For Legal Services logo" width="48" height="48" />
          <span>
            Akol For Legal Services
            <small>ALS</small>
          </span>
        </a>

        <button
          type="button"
          className="menu-button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          Menu
        </button>

        <div
          className={`nav-links${isOpen ? " open" : ""}`}
          id="primary-navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${path === link.href ? " active" : ""}`}
              aria-current={path === link.href ? "page" : undefined}
              onClick={(event) => handleNav(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
