"use client";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AESTHETICS, OUTFITS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { AestheticCard, OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

export default function VaultRoute() {
  return <Suspense fallback={null}><Vault /></Suspense>;
}

function Vault() {
  const { user, saved, toggleSave } = useAura();
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();

  const counts = useMemo(() => {
    const m = {};
    OUTFITS.forEach((o) => (m[o.aesthetic] = (m[o.aesthetic] ?? 0) + 1));
    return m;
  }, []);

  const results = q.length > 1
    ? OUTFITS.filter((o) =>
        `${o.title} ${o.aesthetic} ${o.curator} ${o.items.map((i) => `${i.name} ${i.brand} ${i.slot}`).join(" ")}`
          .toLowerCase().includes(q))
    : null;

  if (results) {
    return (
      <Page>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>{results.length} {results.length === 1 ? "look" : "looks"} for “{q}”</h1>
        <div className="grid-cards" style={{ marginTop: 24 }}>
          {results.map((o) => <OutfitCard key={o.id} outfit={o} saved={saved.includes(o.id)} onSave={toggleSave} />)}
        </div>
        {!results.length && <p className="muted" style={{ marginTop: 20 }}>Nothing matched. Try a brand, a piece like “loafer”, or an aesthetic name.</p>}
      </Page>
    );
  }

  return (
    <Page>
      <header style={{ maxWidth: "62ch" }}>
        <h1 style={{ fontSize: "clamp(42px, 6.5vw, 78px)" }}>Eight aesthetics.<br />Every piece linked.</h1>
        <p className="muted lede" style={{ fontSize: 16.5 }}>
          Open a style to see looks other people actually assembled — then take any one apart down to the shoes.
        </p>
      </header>

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
