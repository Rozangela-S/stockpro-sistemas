import InventorySystem from "@/components/inventorySystem";
import { niches, NicheKey } from "@/data/niches";
import { notFound } from "next/navigation";

export default async function NichePage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche } = await params;

  const config = niches[niche as NicheKey];

  if (!config) {
    notFound();
  }

  return <InventorySystem config={config} />;
}