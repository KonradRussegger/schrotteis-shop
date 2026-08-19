import { theme as c } from "@/lib/theme";

// Hero mit Video-Hintergrund. Solange kein eigenes Video vorliegt, greift ein
// Gradient-Fallback — sobald ein Video verfügbar ist, in /public/hero.mp4
// ablegen, der <video>-Tag ist bereits vorbereitet.
export default function VideoHero() {
  return (
    <section className="relative h-[86vh] min-h-[520px] flex items-end overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/hero-poster.jpg">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.28) 100%)" }}
      />
      {/* Platzhalter, solange kein echtes Video hinterlegt ist. Sobald
          /public/hero.mp4 existiert, diesen Block einfach entfernen. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${c.bgAlt}, #EFE9DE)` }}
      >
        <span className="font-mono text-xs tracking-widest" style={{ color: c.muted }}>
          [ HERO-VIDEO — WERKSTATT / LEDER / STICH ]
        </span>
      </div>
      <div className="relative z-10 px-6 md:px-14 pb-12">
        <p className="font-mono tracking-[0.2em] mb-4" style={{ fontSize: "14px", color: "#fff" }}>
          HANDGENÄHT IN ABTENAU, SALZBURG
        </p>
        <h1 className="font-display font-medium" style={{ fontSize: "clamp(38px,6vw,70px)", color: "#fff", lineHeight: 1.05 }}>
          Jede Naht von Hand.
        </h1>
      </div>
    </section>
  );
}
