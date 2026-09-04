"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bookmark, ChevronLeft, Flame, ShoppingBag, X } from "lucide-react";
import { byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Badge } from "./ui";
import { Magnetic, ease, useAmbientTheme } from "./motion";
import { posterBg } from "./cards";
import { FlatLay } from "./flatlay";

const SLOTS = ["Outerwear", "Top", "Bottoms", "Shoes", "Accessories"];
// Generic fallback for outfits without their own hand-placed hotspots —
// tuned for a standard centered, front-facing full-body shot.
const DEFAULT_HOTSPOTS = { Outerwear: [30, 32], Top: [50, 32], Bottoms: [50, 64], Shoes: [50, 93], Accessories: [70, 46] };

export function OutfitDetail({ outfit }) {
  const a = byId(outfit.aesthetic);
  useAmbientTheme(a.a1, a.a2);
  const { saved, toggleSave, toastMsg, formatPrice } = useAura();
  const [openItem, setOpenItem] = useState(null);
  const isSaved = saved.includes(outfit.id);
  const ordered = SLOTS.flatMap((s) => outfit.items.filter((i) => i.slot === s));
  const total = outfit.items.reduce((s, i) => s + i.price, 0);
  const hotspots = { ...DEFAULT_HOTSPOTS, ...(outfit.hotspots ?? {}) };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
      style={{ "--a1": a.a1, "--a2": a.a2 }}>
      <Link href={`/vault/${a.id}`} className="btn btn-quiet"><ChevronLeft size={16} /> Back to {a.name}</Link>

      <div className="detail">
        <div className="poster glass detail-art">
          {outfit.image ? (
            <img src={outfit.image} alt={outfit.title} className="detail-hero-photo" />
          ) : (
            <>
              <div className="poster-bg" style={{ background: posterBg(outfit) }} />
              <div className="grain" />
              <div className="poster-flatlay" style={{ inset: "6%" }}><FlatLay items={outfit.items} /></div>
            </>
          )}

          {ordered.map((it) => {
            const [x, y] = hotspots[it.slot] ?? [50, 50];
            return (
              <button key={it.id} className="hot hot-pulse" data-on={openItem?.id === it.id}
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
                onClick={() => setOpenItem(it)}
                aria-label={`View ${it.slot}: ${it.name}`}><i /></button>
            );
          })}
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
              <motion.a className="btn btn-solid" href={ordered[0].url} target="_blank" rel="noopener noreferrer"
                onClick={() => toastMsg("Opening the first piece in a new tab")}
                animate={{ boxShadow: ["0 10px 34px -12px var(--a1)", "0 14px 40px -8px var(--a2)", "0 10px 34px -12px var(--a1)"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
                <ShoppingBag size={17} /> Get the look · {formatPrice(total)}
              </motion.a>
            </Magnetic>
            <button className="btn btn-ghost" onClick={() => toggleSave(outfit.id)}>
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save to vault"}
            </button>
          </div>

          <p className="kicker" style={{ marginTop: 22 }}>Tap a dot on the photo, or pick a piece below</p>

          <div className="quick-list">
            {ordered.map((it) => (
              <button key={it.id} className="quick-item" onClick={() => setOpenItem(it)}>
                <span className="quick-swatch">
                  {it.image ? <img src={it.image} alt="" /> : <span style={{ background: it.tone, display: "block", width: "100%", height: "100%" }} />}
                </span>
                <span className="quick-name">{it.name}</span>
                <span className="tabular quick-price">{formatPrice(it.price)}</span>
              </button>
            ))}
          </div>
          <p className="kicker" style={{ marginTop: 12 }}>Links open the retailer's page in a new tab. Prices refresh when a seller updates a listing.</p>
        </div>
      </div>

      <ProductModal item={openItem} onClose={() => setOpenItem(null)} formatPrice={formatPrice} />
    </motion.div>
  );
}

/* Apple-style liquid glass product pop-up. Opens from a hotspot tap or
   the quick list below — same modal either way, so there's one place
   this ever needs to look right. */
function ProductModal({ item, onClose, formatPrice }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="liquid-glass product-modal"
            initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.38, ease }}>
            <button className="product-modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>

            <div className="product-modal-photo">
              {item.image ? <img src={item.image} alt={item.name} /> : <span style={{ background: item.tone, display: "block", width: "100%", height: "100%" }} />}
            </div>

            <div className="product-modal-body">
              <p className="kicker" style={{ color: "var(--a1)" }}>{item.brand}</p>
              <h2 className="product-modal-title">{item.name}</h2>
              {item.description && <p className="muted" style={{ fontSize: 13.5, marginTop: 6, fontStyle: "italic" }}>{item.description}</p>}
              <p className="product-modal-price tabular">{formatPrice(item.price)}</p>

              <Magnetic>
                <a className="btn btn-solid" href={item.url} target="_blank" rel="noopener noreferrer" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
                  Shop now <ArrowUpRight size={16} />
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
