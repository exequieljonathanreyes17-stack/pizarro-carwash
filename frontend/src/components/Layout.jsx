import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import BotonWhatsApp from "./BotonWhatsApp.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-carbon-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BotonWhatsApp />
    </div>
  );
}
