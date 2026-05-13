import CollectionDetailClient from "@/components/collections/CollectionDetailClient";

export function generateStaticParams() {
  // Daftar ID dummy yang bisa diakses
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

const COLLECTIONS_MAP: Record<string, string> = {
  "1": "Pokemon VMAX",
  "2": "Yu-Gi-Oh! Rare",
  "3": "Magic: The Gathering",
  "4": "Digimon Classic",
  "5": "One Piece Card",
  "6": "Basketball Cards",
};

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const title = COLLECTIONS_MAP[id] || "Koleksi Saya";

  return <CollectionDetailClient id={id} initialTitle={title} />;
}
