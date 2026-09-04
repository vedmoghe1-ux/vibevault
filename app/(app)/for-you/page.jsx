"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { OUTFITS, byId, BUDGET_TIERS, outfitPriceINR } from "@/lib/data";
import { useAura } from "@/lib/store";
import { OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

export default function ForYou() {
  const { user, saved, toggleSave } = useAura();
  const [priceOverride, setPriceOverride] = useState(user?.budgetId ?? "all");
  const activeTier = BUDGET_TIERS.find((t) => t.id === priceOverride);

  /* Supabase: move this to a `recommended_outfits` view or an RPC. */
  const scored = useMemo(() => {
    const rank = (id) => (user?.vibes ?? []).indexOf(id);
    return OUTFITS.map((o) => {
      const r = rank(o.aesthetic);
      const base = r === 0 ? 96 : r === 1 ? 91 : r === 2 ? 87 : r > 2 ? 83 : 44 + Math.round((o.saves / 5200) * 22);
      return { ...o, match: Math.min(99, base + (o.promoted ? 1 : 0)), priceINR: outfitPriceINR(o) };
    }).sort((x, y) => Number(y.promoted) - Number(x.promoted) || y.match - x.match || y.saves - x.saves);
  }, [user]);

  const inBudget = (o) => !activeTier || (o.priceINR >= activeTier.min && o.priceINR <= activeTier.max);

  // Real filtering — but if the chosen tier is too narrow to fill a feed,
  // fall back to the unfiltered list rather than showing an empty page.
  const priceFiltered = scored.filter(inBudget);
  const pool = priceFiltered.length >= 3 ? priceFiltered : scored;

  const top = pool.filter((o) => o.match >= 80);
  const stretch = pool.filter((o) => o.match < 80).slice(0, 4);

  return (
    <Page>
      <header className="head-split">
        <div style={{ maxWidth: "56ch" }}>
          <h1 className="h1">Built around your mix</h1>
          <p className="muted lede">
            {(user.vibes ?? []).map((v) => byId(v).name).join(" × ")} — weighted in the order you picked them.
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

      <div className="price-filter">
        <span className="kicker" style={{ marginRight: 4 }}>Price</span>
        <button className="chip" data-on={priceOverride === "all"} onClick={() => setPriceOverride("all")}>Any budget</button>
        {BUDGET_TIERS.map((t) => (
          <button key={t.id} className="chip" data-on={priceOverride === t.id} onClick={() => setPriceOverride(t.id)}>
            {t.emoji} {t.range}
          </button>
        ))}
      </div>
      {priceFiltered.length < 3 && activeTier && (
        <p className="kicker" style={{ marginTop: 8 }}>Not enough looks in {activeTier.name} yet — showing everything instead.</p>
      )}

      <div className="grid-cards" style={{ marginTop: 22 }}>
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
