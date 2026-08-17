// Das Signature-Element aus dem Design-Prototyp: eine Sattelnaht, wie sie bei
// handgenähten Lederwaren mit zwei Nadeln durch dasselbe Loch entsteht.
// Wird als Trennelement zwischen Sektionen verwendet statt generischer Linien.
export default function StitchDivider({ color = "#B8845C", opacity = 0.5 }) {
  return (
    <svg width="100%" height="10" viewBox="0 0 400 10" preserveAspectRatio="none" className="block">
      {Array.from({ length: 40 }).map((_, i) => (
        <line
          key={i}
          x1={i * 10 + 1}
          y1="8"
          x2={i * 10 + 6}
          y2="2"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
