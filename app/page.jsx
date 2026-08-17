import Link from "next/link";
import VideoHero from "@/components/VideoHero";
import PhotoSlider from "@/components/PhotoSlider";
import StitchDivider from "@/components/StitchDivider";

const steps = [
  {
    n: "01",
    title: "Zuschnitt",
    text: "Jedes Teil wird einzeln nach Schablone aus dem Leder oder Fell geschnitten — kein Rollenschnitt, keine zwei Stücke identisch.",
  },
  {
    n: "02",
    title: "Sattelnaht",
    text: "Von Hand genäht mit zwei Nadeln durch dasselbe Loch. Reißt ein Faden, hält die Naht trotzdem.",
  },
  {
    n: "03",
    title: "Kantenschluss",
    text: "Kanten werden geschliffen, gefärbt und poliert — der Unterschied zwischen Handwerk und Massenware.",
  },
  {
    n: "04",
    title: "Fertigstellung",
    text: "Zum Schluss von Hand nachbehandelt, damit Leder und Fell von Anfang an geschützt und langlebig sind.",
  },
];

export default function HomePage() {
  return (
    <main>
      <VideoHero />

      {/* Story-Text direkt nach dem Video-Hero */}
      <section className="px-6 md:px-12 py-20 max-w-[640px] mx-auto text-center">
        <h2 className="font-display text-3xl font-medium mb-5">
          Handwerk, das man trägt
        </h2>
        <p className="text-muted leading-relaxed">
          In der Werkstatt in Abtenau entstehen Lederwaren und Kostümteile für
          Krampus- und Perchtenläufe — jedes Stück von Hand gefertigt, gedacht
          für den täglichen Einsatz und die Beanspruchung im Lauf.
        </p>
      </section>

      <div className="px-6 md:px-12">
        <StitchDivider />
      </div>

      {/* Handwerksprozess — echte Abfolge, daher Nummerierung gerechtfertigt */}
      <section id="handwerk" className="px-6 md:px-12 py-20 bg-bgAlt">
        <h2 className="font-display text-3xl font-medium mb-2">Vom Fell zum fertigen Stück</h2>
        <p className="text-muted max-w-[460px] mb-12">
          Vier Schritte, keiner davon lässt sich abkürzen, ohne dass man es dem Ergebnis ansieht.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-mono text-brass text-sm">{s.n}</span>
              <h3 className="font-display text-lg font-medium mt-2.5 mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 md:px-12">
        <StitchDivider color="#5C3524" opacity={0.8} />
      </div>

      {/* Foto-Slider aus der Werkstatt */}
      <section className="px-6 md:px-12 py-20 max-w-[760px] mx-auto">
        <h2 className="font-display text-3xl font-medium mb-8 text-center">
          Aus der Werkstatt
        </h2>
        <PhotoSlider />
      </section>

      {/* CTA zur Kollektion */}
      <section className="px-6 md:px-12 py-20 text-center">
        <h2 className="font-display text-2xl font-medium mb-6">
          Zur Kollektion
        </h2>
        <Link
          href="/shop"
          className="inline-block px-7 py-3.5 rounded-sm bg-tan text-bg font-mono text-sm font-medium"
        >
          Kollektion entdecken
        </Link>
      </section>
    </main>
  );
}
