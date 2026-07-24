import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="main-content" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
