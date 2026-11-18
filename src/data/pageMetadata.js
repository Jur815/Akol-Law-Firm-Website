export const siteOrigin = "https://www.als-ss.com";

export const pageMetadata = {
  "/": {
    title: "Akol For Legal Services | South Sudan Law Firm",
    description:
      "Akol For Legal Services provides strategic legal counsel, advocacy, dispute resolution, and corporate advisory services for clients in South Sudan.",
  },
  "/about": {
    title: "About Akol For Legal Services | Legal Counsel in South Sudan",
    description:
      "Learn about Akol For Legal Services, a South Sudan law firm focused on strategic legal counsel, integrity, compliance, and practical business solutions.",
  },
  "/services": {
    title: "Practice Areas | Akol For Legal Services",
    description:
      "Explore our legal services in South Sudan, including corporate advisory, commercial litigation, labor law, energy and infrastructure, and sports governance.",
  },
  "/team": {
    title: "Our Team | Akol For Legal Services",
    description:
      "Meet Marco Akol Deng Mawien, founder and CEO, and Marco Ajou Aleu, office manager and legal clerk at Akol For Legal Services.",
  },
  "/contact": {
    title: "Contact Akol For Legal Services | Legal Consultations",
    description:
      "Contact Akol For Legal Services in Juba, South Sudan for legal consultations, corporate advisory, dispute resolution, and Commissioner for Oaths services.",
  },
};

export function getCanonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return Object.hasOwn(pageMetadata, path) ? path : null;
}

export function getPageMetadata(pathname) {
  const canonicalPath = getCanonicalPath(pathname) ?? "/";

  return {
    ...pageMetadata[canonicalPath],
    url: siteOrigin + canonicalPath,
    image: `${siteOrigin}/akol-logo.jpeg`,
  };
}
