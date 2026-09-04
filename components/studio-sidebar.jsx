"use client";
import { useMemo, useState } from "react";
import { OUTFITS } from "@/lib/data";
import { useAura } from "@/lib/store";

const SLOT_GROUPS = ["Outerwear", "Top", "Bottoms", "Shoes", "Accessories"];

/* Item library for the canvas. Pulls from whatever the user has actually
   saved to their vault — that's the "your closet" the spec asks for.
   New accounts with nothing saved yet get a small starter set instead of
   an empty sidebar, so the feature is usable on the very first visit. */
export function StudioSidebar({ onAdd }) {
  const { saved } = useAura();
  const [group, setGroup] = useState("Top");

  const items = useMemo(() => {
    const sourceOutfits = saved.length
      ? OUTFITS.filter((o) => saved.includes(o.id))
      : OUTFITS.slice(0, 6);
    const seen = new Map();
    sourceOutfits.forEach((o) => o.items.forEach((it) => {
      if (!seen.has(it.name)) seen.set(it.name, it);
    }));
    return [...seen.values()];
  }, [saved]);

  const shown = items.filter((i) => i.slot === group);

  return (
    <div className="studio-sidebar glass">
      <p className="kicker" style={{ padding: "14px 14px 8px" }}>
        {saved.length ? "From your saved looks" : "Starter pieces — save looks to build your own closet"}
      </p>
      <div className="studio-groups">
        {SLOT_GROUPS.map((g) => (
          <button key={g} className="chip" data-on={group === g} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="studio-items">
        {shown.map((it) => (
          <button
            key={it.name}
            className="studio-item-tile"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(it))}
            onClick={() => onAdd(it)}
            title={`${it.name} — click or drag onto the canvas`}
          >
            {it.image ? <img src={it.image} alt={it.name} /> : <span className="studio-tile-swatch" style={{ background: it.tone }} />}
            <span className="studio-tile-name">{it.name}</span>
          </button>
        ))}
        {!shown.length && <p className="kicker" style={{ padding: 14 }}>No {group.toLowerCase()} pieces yet.</p>}
      </div>
    </div>
  );
}
