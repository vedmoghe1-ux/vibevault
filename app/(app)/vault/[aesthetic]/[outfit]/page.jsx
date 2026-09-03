"use client";
import { notFound } from "next/navigation";
import { OUTFITS } from "@/lib/data";
import { OutfitDetail } from "@/components/outfit-detail";

export default function OutfitPage({ params }) {
  const outfit = OUTFITS.find((o) => o.id === params.outfit);
  if (!outfit) notFound();
  return <OutfitDetail outfit={outfit} />;
}
