import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { theme as c } from "@/lib/theme";

export default function SiteLayout({ children }) {
  return (
    <div style={{ background: c.bg, color: c.ink, minHeight: "100vh" }}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
