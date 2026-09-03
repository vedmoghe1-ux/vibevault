"use client";
import Link from "next/link";
import { Bookmark, Sparkles } from "lucide-react";
import { OUTFITS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

export default function Saved() {
  const { saved, toggleSave } = useAura();
  const looks = OUTFITS.filter((o) => saved.includes(o.id));

  return (
    <Page>
      <h1 className="h1">Your vault</h1>
      <p className="muted lede">{looks.length} looks kept. Nothing here is public until you share it.</p>

      {looks.length ? (
        <div className="grid-cards" style={{ marginTop: 26 }}>
          {looks.map((o) => <OutfitCard key={o.id} outfit={o} saved onSave={toggleSave} />)}
        </div>
      ) : (
        <div className="glass empty" style={{ marginTop: 26 }}>
          <Bookmark size={26} className="muted" />
          <p style={{ fontWeight: 600, marginTop: 12, fontSize: 17 }}>Nothing saved yet.</p>
          <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>Tap the bookmark on any look and it lands here with all its shopping links.</p>
          <Link href="/for-you" className="btn btn-solid" style={{ marginTop: 20 }}><Sparkles size={16} /> Open my feed</Link>
        </div>
      )}
    </Page>
  );
}
