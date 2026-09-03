"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/* A drag-to-rate bar: 💩 at 0, 🔥 at 100. Built for touch — the thumb is
   large, the drag is direct (1:1 with the finger), and it settles with a
   spring so releasing it always feels a little bouncy and alive. */
export function RatingSlider({ value = 50, onChange, readOnly = false }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [display, setDisplay] = useState(value);
  const x = useMotionValue(value);
  const glow = useTransform(x, [0, 50, 100], [
    "0 0 0 rgba(255,111,165,0)",
    "0 0 0 rgba(255,111,165,0)",
    "0 0 20px 2px rgba(255,138,61,.55)",
  ]);

  const pctFromClientX = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100)));
  };

  const commit = (pct) => {
    setDisplay(pct);
    x.set(pct);
    onChange?.(pct);
  };

  const start = (clientX) => {
    if (readOnly) return;
    setDragging(true);
    commit(pctFromClientX(clientX));
  };
  const move = (clientX) => { if (dragging) commit(pctFromClientX(clientX)); };
  const end = () => setDragging(false);

  const face = display >= 80 ? "🔥" : display >= 55 ? "😌" : display >= 30 ? "😐" : "💩";

  return (
    <div className="rating">
      <span className="rating-emoji">💩</span>
      <div
        ref={trackRef}
        className="rating-track"
        data-dragging={dragging}
        onMouseDown={(e) => start(e.clientX)}
        onMouseMove={(e) => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={(e) => start(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
      >
        <div className="rating-fill" style={{ width: `${display}%` }} />
        <motion.div
          className="rating-thumb"
          style={{ left: `${display}%`, boxShadow: glow }}
          animate={{ scale: dragging ? 1.25 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          {face}
        </motion.div>
      </div>
      <span className="rating-emoji">🔥</span>
      <span className="rating-num tabular">{display}</span>
    </div>
  );
}
