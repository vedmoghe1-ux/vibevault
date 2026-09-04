"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KINDS = [
  { key: "poop", emoji: "💩" },
  { key: "neutral", emoji: "😐" },
  { key: "fire", emoji: "🔥" },
];

/* Tap-and-repeat reactions instead of a drag slider — every press bumps
   that reaction's count and pops a tiny flying copy of the emoji, the
   same instant-feedback pattern as a like button, just three-way. */
export function ReactionButtons({ counts = { fire: 0, neutral: 0, poop: 0 }, onReact }) {
  const [bursts, setBursts] = useState([]);

  const press = (key) => {
    onReact?.(key);
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, { id, key }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 700);
  };

  return (
    <div className="reactions">
      {KINDS.map((k) => (
        <button key={k.key} className="reaction-btn" data-kind={k.key} onClick={() => press(k.key)}
          aria-label={`React ${k.key}`}>
          <span className="reaction-stack">
            <AnimatePresence>
              {bursts.filter((b) => b.key === k.key).map((b) => (
                <motion.span key={b.id} className="reaction-fly"
                  initial={{ opacity: 1, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -30, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}>
                  {k.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
            <motion.span whileTap={{ scale: 0.7 }} className="reaction-emoji">{k.emoji}</motion.span>
          </span>
          <span className="reaction-count tabular">{counts[k.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
