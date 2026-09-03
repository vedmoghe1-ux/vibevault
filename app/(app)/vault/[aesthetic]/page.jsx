"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { OUTFITS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { OutfitCard } from "@/components/cards";
import { Page } from "@/components/motion";

const SLOTS = ["All", "Outerwear", "Top", "Bottoms", "Shoes", "Accessories"];

export default function AestheticPage({ params }) {
  const a = byId(params.aesthetic);
  const { saved, toggleSave } = useAura();
  const [slot, setSlot] = useState("All");

  const looks = OUTFITS.filter((o) => o.aesthetic === a.id);
  const shown = slot === "All" ? looks : looks.filter((o) => o.items.some((i) => i.slot === slot));

  return (
    <Page>
      <div style={{ "--a1": a.a1, "--a2": a.a2 }}>
        <Link href="/vault" className="btn btn-quiet"><ChevronLeft size={16} /> All aesthetics</Link>

        <header className="poster glass hero">
          <div className="hero-bg" style={{ background: `radial-gradient(60% 80% at 20% 20%, ${a.a1}55, transparent 70%), radial-gradient(50% 70% at 85% 90%, ${a.a2}44, transparent 70%), ${a.tone}` }} />
          <div className="grain" />
          <div className="hero-body">
            <h1 style={{ fontSize: "clamp(40px, 7vw, 84px)" }}>{a.name}</h1>
            <p className="hero-sub">{a.tagline}</p>
            <p className="kicker" style={{ marginTop: 12 }}>{a.note} · {looks.length} curated looks</p>
          </div>
        </header>

        <motion.div className="chips" layout style={{ margin: "26px 0 18px" }}>
          {SLOTS.map((s) => (
            <motion.button layout key={s} className="chip" data-on={slot === s} whileTap={{ scale: 0.93 }} onClick={() => setSlot(s)}>
              {s === "All" ? "Every look" : `Has ${s.toLowerCase()}`}
            </motion.button>
          ))}
        </motion.div>

        <motion.div className="grid-cards" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((o) => (
              <OutfitCard key={o.id} outfit={o} saved={saved.includes(o.id)} onSave={toggleSave} />
            ))}
          </AnimatePresence>
        </motion.div>

        {!shown.length && (
          <div className="glass empty">
            <p style={{ fontWeight: 600 }}>
              {looks.length === 0 ? `${a.name} looks are coming soon.` : `No ${a.name} look uses that piece yet.`}
            </p>
            <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>
              {looks.length === 0
                ? "This category is set up and ready — outfits get added here as they're curated."
                : <>Clear the filter, or build the look yourself and list it in Thrift &amp; Sell.</>}
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
