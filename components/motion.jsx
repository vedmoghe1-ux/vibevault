"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export const ease = [0.2, 0.8, 0.3, 1];

/* Button that leans toward the cursor, then springs home. */
export function Magnetic({ children, strength = 0.32 }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const ref = useRef(null);

  if (reduce) return <span>{children}</span>;
  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.span>
  );
}

/* Card tilt with a light glare that tracks the pointer. */
export function Tilt({ children, max = 8, className = "", style, ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 16 });
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 16 });

  return (
    <div
      className={`tilt-wrap ${className}`}
      style={style}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onMouseLeave={() => { px.set(0.5); py.set(0.5); }}
      {...rest}
    >
      <motion.div ref={ref} style={reduce ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", height: "100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* One orchestrated entrance per view, not one per element. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};
export const riseIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/* Scroll-triggered reveal — the mobile-native counterpart to hover effects.
   Fires once as each card enters the viewport while scrolling, which is
   the interaction a phone actually has (no cursor to hover with). */
export function ScrollReveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Page({ children, className = "" }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -8 }} className={className}>
      {children}
    </motion.div>
  );
}
export const Rise = motion.div;
