import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import TeamPage from "../pages/TeamPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
