import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../common/WhatsAppButton";

export default function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
