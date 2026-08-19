// Hero mit Video-Hintergrund. Solange kein eigenes Video vorliegt, greift ein
// Gradient-Fallback (poster-artig) — sobald ein Video verfügbar ist, einfach
// in /public/hero.mp4 ablegen, der <video>-Tag ist bereits vorbereitet.
export default function VideoHero() {
  return (
    <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        {/* Eigenes Video hier einbinden, z.B. Werkstatt-Aufnahmen, Nahaufnahmen
            von Nadel & Leder, Krampus-/Perchten-Kostüme in Bewegung */}
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Abdunkelung, damit Logo/Text über dem Video lesbar bleiben */}
      <div className="absolute inset-0 bg-bg/60" />

      <div className="relative z-10 text-center px-6">
        <p className="font-mono text-brass text-xs tracking-[0.2em] mb-4">
          HANDGEFERTIGT IN ABTENAU, SALZBURG
        </p>
        <h1 className="font-display font-medium text-cream text-[clamp(38px,7vw,84px)] leading-[1.02]">
          Schrotteis
          <br />
          <span className="text-tan">Gwandlstubn</span>
        </h1>
      </div>
    </section>
  );
}
