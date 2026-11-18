import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMetadata } from "../../data/pageMetadata";

function setMeta(selector, attribute, value) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description, url } = getPageMetadata(pathname);

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
  }, [pathname]);

  return null;
}
