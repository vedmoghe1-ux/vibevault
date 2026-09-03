"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Rocket } from "lucide-react";
import { AESTHETICS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { ListingCard } from "@/components/cards";
import { Page, Magnetic } from "@/components/motion";
import { useChrome } from "../layout";

export default function Market() {
  const { listings, toastMsg } = useAura();
  const { openSell, openPricing } = useChrome();
  const [filter, setFilter] = useState("all");

  const flag = (v) => (v ? 1 : 0);
  const shown = (filter === "all" ? listings : listings.filter((l) => l.aesthetic === filter))
    .slice().sort((a, b) => flag(b.promoted) - flag(a.promoted) || flag(b.mine) - flag(a.mine));

  const buy = (l) => {
    if (l.url && l.url !== "#") window.open(l.url, "_blank", "noopener");
    toastMsg(`Message sent to ${l.seller}`);
  };

  return (
    <Page>
      <header className="head-split">
        <div style={{ maxWidth: "54ch" }}>
          <h1 className="h1">Thrift &amp; sell</h1>
          <p className="muted lede">
            List one piece or a whole bundle. Buyers find you through the same aesthetic tags they browse with.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => openPricing(null)}><Rocket size={16} /> Promotion pricing</button>
          <Magnetic><button className="btn btn-solid" onClick={openSell}><Plus size={17} /> Sell your closet</button></Magnetic>
        </div>
      </header>

      <motion.div className="chips" layout style={{ margin: "26px 0 20px" }}>
        <motion.button layout className="chip" data-on={filter === "all"} whileTap={{ scale: 0.93 }} onClick={() => setFilter("all")}>Everything</motion.button>
        {AESTHETICS.map((a) => (
          <motion.button layout key={a.id} className="chip" data-on={filter === a.id} whileTap={{ scale: 0.93 }} onClick={() => setFilter(a.id)}>
            <span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />{a.name}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="grid-cards-sm" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((l) => <ListingCard key={l.id} l={l} onBuy={buy} onPromote={openPricing} />)}
        </AnimatePresence>
      </motion.div>

      {!shown.length && (
        <div className="glass empty">
          <p style={{ fontWeight: 600, fontSize: 17 }}>Nothing listed in this style yet.</p>
          <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>Be the first seller here — listings in empty categories get shown to every matching buyer for free.</p>
          <button className="btn btn-solid" style={{ marginTop: 18 }} onClick={openSell}><Plus size={16} /> Create a listing</button>
        </div>
      )}
    </Page>
  );
}
