"use client";
import Link from "next/link";
import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { OUTFITS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

export default function ForYou() {
  const { user, saved, toggleSave } = useAura();

  /* Supabase: move this to a `recommended_outfits` view or an RPC. */
  const scored = useMemo(() => {
    const rank = (id) => (user?.vibes ?? []).indexOf(id);
    return OUTFITS.map((o) => {
      const r = rank(o.aesthetic);
      const base = r === 0 ? 96 : r === 1 ? 91 : r === 2 ? 87 : r > 2 ? 83 : 44 + Math.round((o.saves / 5200) * 22);
      return { ...o, match: Math.min(99, base + (o.promoted ? 1 : 0)) };
    }).sort((x, y) => Number(y.promoted) - Number(x.promoted) || y.match - x.match || y.saves - x.saves);
  }, [user]);

  const top = scored.filter((o) => o.match >= 80);
  const stretch = scored.filter((o) => o.match < 80).slice(0, 4);

  return (
    <Page>
      <header className="head-split">
        <div style={{ maxWidth: "56ch" }}>
          <h1 className="h1">Built around your mix</h1>
          <p className="muted lede">
            {(user.vibes ?? []).map((v) => byId(v).name).join(" × ")} — weighted in the order you picked them. {user.budget} budget applied.
          </p>
        </div>
        <Link href="/onboarding" className="btn btn-ghost"><Sparkles size={16} /> Change my vibe</Link>
      </header>

      <div className="chips" style={{ marginTop: 22 }}>
        {(user.vibes ?? []).map((v) => {
          const a = byId(v);
          return <span key={v} className="chip" data-on="true"><span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />{a.name}</span>;
        })}
      </div>

      <div className="grid-cards" style={{ marginTop: 28 }}>
        {top.map((o) => <OutfitCard key={o.id} outfit={o} match={o.match} saved={saved.includes(o.id)} onSave={toggleSave} />)}
      </div>

      <div className="section-head">
        <h2 style={{ fontSize: 22 }}>A little outside your mix</h2>
        <span className="kicker">Saving one of these teaches the feed</span>
      </div>
      <div className="grid-cards">
        {stretch.map((o) => <OutfitCard key={o.id} outfit={o} match={o.match} saved={saved.includes(o.id)} onSave={toggleSave} />)}
      </div>
    </Page>
  );
}
