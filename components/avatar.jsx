"use client";
import { motion } from "framer-motion";

/* A personalized stand-in figure — skin tone and hair are set once at
   onboarding, then this same figure wears every outfit's garments,
   colored from that outfit's real item data. This is the buildable
   version of "try it on": no camera, no biometric data, just a
   consistent character that's yours across the whole app. */

function Hair({ style, color }) {
  switch (style) {
    case "bald": return null;
    case "buzz": return <path d="M92 30 Q120 20 148 30 Q150 42 148 48 Q120 38 92 48 Q90 42 92 30 Z" fill={color} />;
    case "curly": return (
      <g fill={color}>
        <circle cx="98" cy="32" r="12" /><circle cx="112" cy="24" r="13" /><circle cx="128" cy="24" r="13" /><circle cx="142" cy="32" r="12" />
        <circle cx="120" cy="20" r="12" />
      </g>
    );
    case "long": return <path d="M88 34 Q86 70 92 96 L104 92 Q98 60 100 34 Q120 20 140 34 Q142 60 136 92 L148 96 Q154 70 152 34 Q120 8 88 34 Z" fill={color} />;
    default: return <path d="M90 32 Q120 14 150 32 Q152 44 148 50 Q120 36 92 50 Q88 44 90 32 Z" fill={color} />; // short
  }
}

export function Avatar({ skin = "#C68B59", hair = "short", hairColor = "#1B1512", items = [], activeSlot, onSlot, size = 100 }) {
  const tone = (slot, fallback) => items.find((i) => i.slot === slot)?.tone || fallback;
  const has = (slot) => items.some((i) => i.slot === slot);
  const dim = (slot) => (activeSlot && activeSlot !== slot ? 0.28 : 1);
  const wearing = items.length > 0;

  return (
    <svg viewBox="0 0 240 400" style={{ width: `${size}%`, height: `${size}%`, display: "block" }} role="img" aria-label="Your avatar">
      {/* skin */}
      <circle cx="120" cy="60" r="30" fill={skin} />
      <rect x="102" y="82" width="36" height="26" rx="10" fill={skin} />
      {wearing || (
        <>
          <rect x="96" y="104" width="48" height="90" rx="18" fill={skin} opacity="0.9" />
          <rect x="96" y="196" width="20" height="100" rx="9" fill={skin} opacity="0.85" />
          <rect x="124" y="196" width="20" height="100" rx="9" fill={skin} opacity="0.85" />
        </>
      )}
      <Hair style={hair} color={hairColor} />

      {/* face — big soft Snapchat-style eyes, a light blush, a small smile */}
      <g>
        <ellipse cx="108" cy="60" rx="6.5" ry="8.5" fill="#1B1512" />
        <ellipse cx="132" cy="60" rx="6.5" ry="8.5" fill="#1B1512" />
        <circle cx="110.2" cy="57" r="2.1" fill="#fff" />
        <circle cx="134.2" cy="57" r="2.1" fill="#fff" />
        <ellipse cx="98" cy="70" rx="6" ry="3.5" fill="#FF9E9E" opacity="0.35" />
        <ellipse cx="142" cy="70" rx="6" ry="3.5" fill="#FF9E9E" opacity="0.35" />
        <path d="M111 76 Q120 82 129 76" stroke="#1B1512" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>

      {/* garments — same slot logic as the outfit mannequin */}
      {has("Bottoms") && (
        <motion.g animate={{ opacity: dim("Bottoms") }} onClick={() => onSlot?.(activeSlot === "Bottoms" ? null : "Bottoms")} style={{ cursor: onSlot ? "pointer" : "default" }}>
          <path d="M92 196 h56 l10 116 h-30 l-8 -74 -8 74 h-30 z" fill={tone("Bottoms", "#2A2A31")} />
        </motion.g>
      )}
      {has("Shoes") && (
        <motion.g animate={{ opacity: dim("Shoes") }} onClick={() => onSlot?.(activeSlot === "Shoes" ? null : "Shoes")} style={{ cursor: onSlot ? "pointer" : "default" }}>
          <rect x="88" y="312" width="34" height="17" rx="7" fill={tone("Shoes", "#2A2A31")} />
          <rect x="128" y="312" width="34" height="17" rx="7" fill={tone("Shoes", "#2A2A31")} />
        </motion.g>
      )}
      {has("Top") && (
        <motion.g animate={{ opacity: dim("Top") }} onClick={() => onSlot?.(activeSlot === "Top" ? null : "Top")} style={{ cursor: onSlot ? "pointer" : "default" }}>
          <path d="M88 108 q32 -14 64 0 l8 44 -14 6 v70 h-52 v-70 l-14 -6 z" fill={tone("Top", "#3A3A44")} />
        </motion.g>
      )}
      {has("Outerwear") && (
        <motion.g animate={{ opacity: dim("Outerwear") }} onClick={() => onSlot?.(activeSlot === "Outerwear" ? null : "Outerwear")} style={{ cursor: onSlot ? "pointer" : "default" }}>
          <path d="M84 110 q-16 8 -18 30 l-6 62 18 4 6 -46 v76 h20 v-118 z" fill={tone("Outerwear", "#3A3A44")} />
          <path d="M156 110 q16 8 18 30 l6 62 -18 4 -6 -46 v76 h-20 v-118 z" fill={tone("Outerwear", "#3A3A44")} />
        </motion.g>
      )}
      {has("Accessories") && (
        <motion.g animate={{ opacity: dim("Accessories") }} onClick={() => onSlot?.(activeSlot === "Accessories" ? null : "Accessories")} style={{ cursor: onSlot ? "pointer" : "default" }}>
          <rect x="104" y="170" width="32" height="9" rx="4" fill={tone("Accessories", "#8E8AA3")} />
          <circle cx="176" cy="216" r="13" fill={tone("Accessories", "#8E8AA3")} opacity="0.9" />
        </motion.g>
      )}
    </svg>
  );
}
