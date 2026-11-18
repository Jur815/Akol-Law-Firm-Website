import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../common/WhatsAppButton";
import Seo from "../common/Seo";
import { getNavigationOrigin, updateNavigationFocus } from "../../utils/navigationFocus";

export default function Layout({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef(null);
  const previousLocation = useRef(null);
  const origins = useRef(new Map());

  function rememberNavigationOrigin(event) {
    const origin = getNavigationOrigin(event);
    if (origin) origins.current.set(location.key, origin);
  }

  useEffect(() => {
    const previous = previousLocation.current;
    if (previous === location) return;
    previousLocation.current = location;

    return updateNavigationFocus(mainRef.current, {
      hash: location.hash,
      initial: !previous,
      history: navigationType === "POP",
      origin: origins.current.get(location.key),
    });
  }, [location, navigationType]);

  return (
    <div className="site-wrapper" onClickCapture={rememberNavigationOrigin}>
      <Seo />
      <Navbar />
      <main ref={mainRef}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
