"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bookmark, ChevronLeft, Flame, ShoppingBag } from "lucide-react";
import { byId, money } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Badge } from "./ui";
import { Magnetic, ease } from "./motion";
import { posterBg } from "./cards";

const SLOTS = ["Outerwear", "Top", "Bottoms", "Shoes", "Accessories"];
const HOT = { Outerwear: [24, 30], Top: [50, 30], Bottoms: [50, 58], Shoes: [50, 82], Accessories: [74, 46] };

export function Mannequin({ items, activeSlot, onSlot, palette }) {
  const tone = (s, f) => items.find((i) => i.slot === s)?.tone || f;
  const has = (s) => items.some((i) => i.slot === s);
  const props = (s) => ({
    animate: { opacity: activeSlot && activeSlot !== s ? 0.28 : 1, y: activeSlot === s ? -3 : 0 },
    transition: { duration: 0.35, ease },
    onClick: () => has(s) && onSlot(activeSlot === s ? null : s),
    style: { cursor: has(s) ? "pointer" : "default" },
  });
  return (
    <svg viewBox="0 0 240 400" className="mannequin" role="img" aria-label="Outfit breakdown figure">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.a1} stopOpacity=".22" />
          <stop offset="100%" stopColor={palette.a2} stopOpacity=".1" />
        </linearGradient>
      </defs>
      <rect width="240" height="400" fill="url(#mg)" />
      <circle cx="120" cy="52" r="26" fill="rgba(255,255,255,.13)" />
      <motion.g {...props("Bottoms")}>
        <path d="M92 196 h56 l10 116 h-30 l-8 -74 -8 74 h-30 z" fill={tone("Bottoms", "#2A2A31")} />
      </motion.g>
      <motion.g {...props("Shoes")}>
        <rect x="88" y="312" width="34" height="17" rx="7" fill={tone("Shoes", "#2A2A31")} />
        <rect x="128" y="312" width="34" height="17" rx="7" fill={tone("Shoes", "#2A2A31")} />
      </motion.g>
      <motion.g {...props("Top")}>
        <path d="M88 88 q32 -14 64 0 l8 44 -14 6 v70 h-52 v-70 l-14 -6 z" fill={tone("Top", "#3A3A44")} />
      </motion.g>
      {has("Outerwear") && (
        <motion.g {...props("Outerwear")}>
          <path d="M84 90 q-16 8 -18 30 l-6 62 18 4 6 -46 v76 h20 v-118 z" fill={tone("Outerwear", "#3A3A44")} />
          <path d="M156 90 q16 8 18 30 l6 62 -18 4 -6 -46 v76 h-20 v-118 z" fill={tone("Outerwear", "#3A3A44")} />
        </motion.g>
      )}
      {has("Accessories") && (
        <motion.g {...props("Accessories")}>
          <rect x="104" y="150" width="32" height="9" rx="4" fill={tone("Accessories", "#8E8AA3")} />
          <circle cx="176" cy="196" r="13" fill={tone("Accessories", "#8E8AA3")} opacity=".9" />
        </motion.g>
      )}
    </svg>
  );
}

export function OutfitDetail({ outfit }) {
  const a = byId(outfit.aesthetic);
  const { saved, toggleSave, toastMsg } = useAura();
  const [slot, setSlot] = useState(null);
  const isSaved = saved.includes(outfit.id);
  const ordered = SLOTS.flatMap((s) => outfit.items.filter((i) => i.slot === s));
  const total = outfit.items.reduce((s, i) => s + i.price, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
      style={{ "--a1": a.a1, "--a2": a.a2 }}>
      <Link href={`/vault/${a.id}`} className="btn btn-quiet"><ChevronLeft size={16} /> Back to {a.name}</Link>

      <div className="detail">
        <div className="poster glass detail-art">
          <div className="poster-bg" style={{ background: posterBg(outfit) }} />
          <div className="grain" />
          <div className="detail-figure">
            <Mannequin items={outfit.items} activeSlot={slot} onSlot={setSlot} palette={a} />
          </div>
          {ordered.map((it) => {
            const [x, y] = HOT[it.slot] ?? [50, 50];
            return (
              <button key={it.id} className={`hot ${slot ? "" : "hot-pulse"}`} data-on={slot === it.slot}
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
                onClick={() => setSlot(slot === it.slot ? null : it.slot)}
                aria-label={`Highlight ${it.slot}: ${it.name}`}><i /></button>
            );
          })}
          <div className="detail-hint">
            <AnimatePresence mode="wait">
              <motion.span key={slot ?? "none"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Badge>{slot ? `${slot} · ${outfit.items.find((i) => i.slot === slot)?.brand}` : "Tap a dot to isolate a piece"}</Badge>
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div className="detail-tags">
            <Badge><span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} /> {a.name}</Badge>
            {outfit.promoted && <Badge kind="badge-hot"><Flame size={12} /> Featured by {outfit.curator}</Badge>}
          </div>

          <h1 className="detail-h1">{outfit.title}</h1>
          <p className="muted detail-blurb">{outfit.blurb}</p>

          <div className="detail-actions">
            <Magnetic>
              <a className="btn btn-solid" href={ordered[0].url} target="_blank" rel="noopener noreferrer"
                onClick={() => toastMsg("Opening the first piece in a new tab")}>
                <ShoppingBag size={17} /> Get the look · {money(total)}
              </a>
            </Magnetic>
            <button className="btn btn-ghost" onClick={() => toggleSave(outfit.id)}>
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save to vault"}
            </button>
          </div>

          <div className="detail-head">
            <h2 style={{ fontSize: 20 }}>Every piece in this look</h2>
            <span className="kicker">{ordered.length} items · {money(total)} total</span>
          </div>

          <div className="glass ledger">
            {ordered.map((it, n) => (
              <div key={it.id}>
                <div className="row" data-on={slot === it.slot}
                  onMouseEnter={() => setSlot(it.slot)} onMouseLeave={() => setSlot(null)}>
                  <span className="swatch" style={{ background: it.tone }} />
                  <div style={{ minWidth: 0 }}>
                    <p className="row-name">{it.name}</p>
                    <p className="kicker" style={{ marginTop: 3 }}>{it.slot} · {it.brand}</p>
                  </div>
                  <div className="row-buy">
                    <span className="tabular row-price">{money(it.price)}</span>
                    <a className="btn btn-ghost btn-xs" href={it.url} target="_blank" rel="noopener noreferrer">
                      Buy <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
                {n < ordered.length - 1 && <hr className="hair" style={{ margin: "0 16px" }} />}
              </div>
            ))}
          </div>
          <p className="kicker" style={{ marginTop: 12 }}>Links open a live product search at each brand. Prices are indicative and refresh when a seller updates a listing.</p>
        </div>
      </div>
    </motion.div>
  );
}
