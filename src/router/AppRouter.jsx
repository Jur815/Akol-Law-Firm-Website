import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import TeamPage from "../pages/TeamPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import { getCurrentPath } from "../utils/router";

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/services": ServicesPage,
  "/team": TeamPage,
  "/contact": ContactPage,
};

export default function AppRouter() {
  const [path, setPath] = useState(getCurrentPath);
  const Page = routes[path] ?? NotFoundPage;

  useEffect(() => {
    function handleRouteChange() {
      setPath(getCurrentPath());
    }

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("app:navigate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("app:navigate", handleRouteChange);
    };
  }, []);

  return (
    <Layout>
      <Page />
    </Layout>
  );
}
