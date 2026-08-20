import GutscheinForm from "@/components/GutscheinForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata = {
  title: "Geschenkgutschein — Schrotteis Gwandlstubn",
};

export default function GutscheinPage() {
  return <GutscheinForm />;
}
