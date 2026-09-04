"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AESTHETICS, OUTFITS, OCCASIONS, SEASONS, tagOutfit } from "@/lib/data";
import { useAura } from "@/lib/store";
import { AestheticCard, OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

export default function VaultRoute() {
  return <Suspense fallback={null}><Vault /></Suspense>;
}

function Vault() {
  const { user, saved, toggleSave } = useAura();
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const [occasion, setOccasion] = useState("all");

  const counts = useMemo(() => {
    const m = {};
    OUTFITS.forEach((o) => (m[o.aesthetic] = (m[o.aesthetic] ?? 0) + 1));
    return m;
  }, []);

  const tagged = useMemo(() => OUTFITS.map((o) => ({ ...o, tags: tagOutfit(o) })), []);

  const results = q.length > 1
    ? tagged.filter((o) =>
        `${o.title} ${o.aesthetic} ${o.curator} ${o.items.map((i) => `${i.name} ${i.brand} ${i.slot}`).join(" ")}`
          .toLowerCase().includes(q))
    : null;

  const occasionFiltered = occasion === "all"
    ? null
    : tagged.filter((o) => o.tags.seasons.includes(occasion) || o.tags.occasions.includes(occasion));

  const activeList = results ?? occasionFiltered;

  if (activeList) {
    const label = results ? `for "${q}"` : `for ${occasion}`;
    return (
      <Page>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>{activeList.length} {activeList.length === 1 ? "look" : "looks"} {label}</h1>
        <OccasionRow occasion={occasion} setOccasion={setOccasion} />
        <div className="grid-cards" style={{ marginTop: 20 }}>
          {activeList.map((o) => <OutfitCard key={o.id} outfit={o} saved={saved.includes(o.id)} onSave={toggleSave} />)}
        </div>
        {!activeList.length && <p className="muted" style={{ marginTop: 20 }}>Nothing matched yet — try a different occasion or clear the filter.</p>}
      </Page>
    );
  }

  return (
    <Page>
      <header style={{ maxWidth: "62ch" }}>
        <h1 style={{ fontSize: "clamp(42px, 6.5vw, 78px)" }}>Twelve aesthetics.<br />Every piece linked.</h1>
        <p className="muted lede" style={{ fontSize: 16.5 }}>
          Open a style to see looks other people actually assembled — then take any one apart down to the shoes.
        </p>
      </header>

      <OccasionRow occasion={occasion} setOccasion={setOccasion} />

      <div className="glass ticker">
        <div className="marquee">
          {[...AESTHETICS, ...AESTHETICS].map((a, i) => (
            <span key={i} className="kicker ticker-item">
              <span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />
              {a.name} — {a.note}
            </span>
          ))}
        </div>
      </div>

      <section style={{ marginTop: 40 }}>
        <div className="section-head" style={{ margin: "0 0 16px" }}>
          <h2 style={{ fontSize: 24 }}>The vault</h2>
          <span className="kicker">{OUTFITS.length} looks · updated Fridays</span>
        </div>
        <div className="grid-cards">
          {AESTHETICS.map((a) => (
            <AestheticCard key={a.id} a={a} count={counts[a.id] ?? 0} picked={(user.vibes ?? []).includes(a.id)} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 style={{ fontSize: 24 }}>Featured this week</h2>
          <span className="kicker">Paid placements by curators — always marked</span>
        </div>
        <div className="grid-cards">
          {OUTFITS.filter((o) => o.promoted).map((o) => (
            <OutfitCard key={o.id} outfit={o} saved={saved.includes(o.id)} onSave={toggleSave} />
          ))}
        </div>
      </section>
    </Page>
  );
}

const OCCASION_EMOJI = { Wedding: "💍", "Date Night": "🌹", "Boys Hangout": "🏀", "Night Out": "🌙", Everyday: "☀️", Summer: "🌞", Winter: "❄️", Monsoon: "🌧️", "All Season": "🌤️" };

function OccasionRow({ occasion, setOccasion }) {
  return (
    <div className="price-filter" style={{ marginTop: 18 }}>
      <span className="kicker" style={{ marginRight: 4 }}>Dress for</span>
      <button className="chip" data-on={occasion === "all"} onClick={() => setOccasion("all")}>Everything</button>
      {[...OCCASIONS, ...SEASONS].map((o) => (
        <button key={o} className="chip" data-on={occasion === o} onClick={() => setOccasion(o)}>{OCCASION_EMOJI[o]} {o}</button>
      ))}
    </div>
  );
}
