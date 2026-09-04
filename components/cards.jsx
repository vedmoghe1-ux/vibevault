"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Bookmark, Flame, Heart, Sparkles, Check, ShoppingBag, Rocket, BadgeCheck } from "lucide-react";
import { byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Tilt, ScrollReveal } from "./motion";
import { FlatLay } from "./flatlay";
import { Badge } from "./ui";

export const posterBg = (o) => {
  const a = byId(o.aesthetic);
  const t = o.items.map((i) => i.tone);
  return `radial-gradient(62% 55% at 24% 18%, ${a.a1}55, transparent 68%),
          radial-gradient(58% 52% at 82% 78%, ${a.a2}4D, transparent 70%),
          linear-gradient(158deg, ${t[0]}, ${t[t.length - 1]})`;
};

/* Tap-triggered heart burst — a mobile-native "double-tap to like" feel.
   Fires on the tap itself, not a hover state, so it reads on phones. */
function SaveButton({ saved, onSave }) {
  const [burst, setBurst] = useState(0);
  return (
    <span className="save-btn-wrap">
      <button className="badge icon-badge" aria-label={saved ? "Remove from saved" : "Save this look"}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(); if (!saved) setBurst((b) => b + 1); }}
        style={{ color: saved ? "var(--a1)" : "inherit" }}>
        <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
      </button>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span key={burst} className="heart-burst"
            initial={{ opacity: 1, scale: 0.4, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            onAnimationComplete={() => setBurst(0)}>
            <Heart size={20} fill="currentColor" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function OutfitCard({ outfit, saved, onSave, match }) {
  const a = byId(outfit.aesthetic);
  const { formatPrice } = useAura();
  return (
    <ScrollReveal>
      <Tilt style={{ "--a1": a.a1, "--a2": a.a2 }}>
        <Link href={`/vault/${outfit.aesthetic}/${outfit.id}`} className="poster glass" style={{ height: 340, display: "block" }}>
          <div className="poster-bg" style={{ background: posterBg(outfit) }} />
          <div className="grain" />
          {outfit.image
            ? <img src={outfit.image} alt="" className="poster-photo" />
            : <div className="poster-flatlay"><FlatLay items={outfit.items} /></div>}
          <div className="poster-word">{a.name}</div>
          <div className="tilt-glare" />
          <div className="poster-body">
            <div className="poster-row">
              <div className="poster-tags">
                {outfit.promoted && <Badge kind="badge-hot"><Flame size={12} /> Featured</Badge>}
                {match != null && <Badge><Sparkles size={12} /> {match}% match</Badge>}
              </div>
              <SaveButton saved={saved} onSave={() => onSave(outfit.id)} />
            </div>
            <div>
              <h3 className="poster-title">{outfit.title}</h3>
              <div className="poster-meta">
                <span>{outfit.curator}</span>
                <span className="tabular"><Heart size={11} /> {outfit.saves.toLocaleString()}</span>
                <span className="tabular">{outfit.items.length} pieces · {formatPrice(outfit.items.reduce((s, i) => s + i.price, 0))}</span>
              </div>
            </div>
          </div>
        </Link>
      </Tilt>
    </ScrollReveal>
  );
}

export function AestheticCard({ a, count, picked }) {
  return (
    <ScrollReveal>
      <Tilt max={6} style={{ "--a1": a.a1, "--a2": a.a2 }}>
        <Link href={`/vault/${a.id}`} className="poster glass" style={{ height: 250, display: "block" }}>
          <div className="poster-bg" style={{ background: `radial-gradient(70% 60% at 30% 20%, ${a.a1}66, transparent 70%), radial-gradient(60% 60% at 78% 82%, ${a.a2}55, transparent 70%), ${a.tone}` }} />
          <div className="grain" />
          <div className="tilt-glare" />
          <div className="poster-body">
            <div className="poster-row">
              {picked && <Badge><Check size={12} /> in your mix</Badge>}
              <span className="badge tabular" style={{ marginLeft: "auto" }}>{count} looks</span>
            </div>
            <div>
              <h3 style={{ fontSize: "clamp(22px, 5.5vw, 32px)" }}>{a.name}</h3>
              <p className="poster-sub">{a.tagline}</p>
              <p className="kicker" style={{ marginTop: 10 }}>{a.note}</p>
            </div>
          </div>
        </Link>
      </Tilt>
    </ScrollReveal>
  );
}

export function ListingCard({ l, onBuy, onPromote }) {
  const a = byId(l.aesthetic);
  const { formatPrice } = useAura();
  return (
    <ScrollReveal>
      <Tilt max={5} style={{ "--a1": a.a1, "--a2": a.a2 }}>
        <article className="glass listing">
          <div className="poster listing-art">
            {l.image
              ? <img src={l.image} alt="" className="poster-bg listing-img" />
              : <div className="poster-bg" style={{ background: `radial-gradient(65% 60% at 30% 25%, ${a.a1}66, transparent 70%), linear-gradient(150deg, ${l.tone || a.tone}, ${a.tone})` }} />}
            <div className="grain" />
            <div className="listing-tags">
              {l.promoted && <Badge kind="badge-hot"><Flame size={12} /> Featured</Badge>}
              {l.mine && <Badge kind="badge-live"><BadgeCheck size={12} /> Your listing</Badge>}
            </div>
          </div>
          <div className="listing-body">
            <div>
              <h3 style={{ fontSize: 17, lineHeight: 1.25 }}>{l.title}</h3>
              <p className="kicker" style={{ marginTop: 7 }}>{l.seller} · {a.name} · {l.condition}</p>
            </div>
            <div className="listing-foot">
              <span className="display tabular" style={{ fontSize: 21 }}>{formatPrice(l.price)}</span>
              {l.mine && !l.promoted
                ? <button className="btn btn-ghost btn-sm" onClick={() => onPromote(l)}><Rocket size={14} /> Promote</button>
                : <button className="btn btn-solid btn-sm" onClick={() => onBuy(l)}><ShoppingBag size={14} /> Buy</button>}
            </div>
          </div>
        </article>
      </Tilt>
    </ScrollReveal>
  );
}
