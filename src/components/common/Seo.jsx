import { useEffect } from "react";

const siteTitle = "Akol For Legal Services | Advocates & Commissioners for Oaths";
const defaultDescription =
  "Akol For Legal Services provides strategic legal counsel, advocacy, dispute resolution, and corporate advisory services for clients in South Sudan.";

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

export default function Seo({ title = siteTitle, description = defaultDescription, path = "/" }) {
  useEffect(() => {
    const url = `https://akolforlegalservices.com${path}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
  }, [description, path, title]);

  return null;
}
