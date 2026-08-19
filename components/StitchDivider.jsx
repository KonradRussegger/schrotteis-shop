import { theme as c } from "@/lib/theme";

// Schmaler Trennstrich (ursprünglich eine Sattelnaht-Grafik, auf Wunsch
// vereinfacht zu einer schlichten Linie).
export default function StitchDivider({ opacity = 0.4 }) {
  return <div style={{ width: "100%", height: "1px", background: c.tan, opacity }} />;
}
