"use client";

/* A generated flat-lay illustration built entirely from an outfit's own
   item colors — no photos, no copyright risk, and it actually shows what
   you're clicking on: a shirt shape, pants shape, and shoe shape, each
   tinted to match the real garment it stands for. This is the fix for
   "I don't know what's in this card" without borrowing anyone's photo. */
export function FlatLay({ items, size = 100 }) {
  const tone = (slot, fallback) => items.find((i) => i.slot === slot)?.tone || fallback;
  const has = (slot) => items.some((i) => i.slot === slot);

  return (
    <svg viewBox="0 0 200 200" className="flatlay" style={{ width: `${size}%`, height: `${size}%` }} aria-hidden="true">
      {has("Outerwear") && (
        <path d="M46 46 Q40 42 30 50 L38 78 L48 72 L48 130 Q100 142 152 130 L152 72 L162 78 L170 50 Q160 42 154 46 Q128 32 100 32 Q72 32 46 46 Z"
          fill={tone("Outerwear", "#3A3A44")} opacity="0.94" />
      )}
      {has("Top") && (
        <path d="M62 54 Q80 44 100 44 Q120 44 138 54 L144 76 L128 82 L128 128 Q100 136 72 128 L72 82 L56 76 Z"
          fill={tone("Top", "#4A4A54")} opacity="0.98" />
      )}
      {has("Bottoms") && (
        <path d="M70 138 L130 138 L136 188 L108 188 L100 154 L92 188 L64 188 Z"
          fill={tone("Bottoms", "#2A2A31")} />
      )}
      {has("Shoes") && (
        <>
          <ellipse cx="78" cy="192" rx="17" ry="6.5" fill={tone("Shoes", "#20181A")} />
          <ellipse cx="122" cy="192" rx="17" ry="6.5" fill={tone("Shoes", "#20181A")} />
        </>
      )}
      {has("Accessories") && (
        <circle cx="100" cy="100" r="8" fill={tone("Accessories", "#C9A24A")} opacity="0.9" />
      )}
    </svg>
  );
}
