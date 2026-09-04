"use client";
import { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { RotateCw, Maximize2, X } from "lucide-react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* One garment placed on the Studio Canvas. Position lives in the parent's
   state as a percentage of the canvas (item.x/item.y), so it stays
   correctly placed if the canvas itself is resized. Framer Motion owns
   the drag transform frame-by-frame (x/y motion values) for smooth
   dragging; the moment a drag ends, that pixel offset is converted into
   a percentage and folded into item.x/item.y, and the motion values are
   reset to 0 — otherwise the offset would be double-counted on the next
   render. Resize and rotate are plain pointer math (distance and angle
   from the item's own center), since neither needs a library. */
export function CanvasItem({ item, selected, canvasRef, onSelect, onChange, onDelete }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = (e, info) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dxPct = (info.offset.x / rect.width) * 100;
    const dyPct = (info.offset.y / rect.height) * 100;
    onChange({ x: clamp(item.x + dxPct, 2, 98), y: clamp(item.y + dyPct, 2, 98) });
    x.set(0);
    y.set(0);
  };

  const startResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    const startScale = item.scale;

    const onMove = (ev) => {
      const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      const next = clamp(startScale * (dist / startDist), 0.35, 3);
      onChange({ scale: next });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startRotate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const onMove = (ev) => {
      const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI) + 90;
      onChange({ rotation: Math.round(angle) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <motion.div
      ref={ref}
      className="canvas-item"
      data-selected={selected}
      style={{
        left: `${item.x}%`, top: `${item.y}%`, zIndex: item.z,
        x, y,
        rotate: item.rotation,
        scale: item.scale,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(item.uid); }}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="canvas-item-art">
        {item.image
          ? <img src={item.image} alt={item.name} draggable={false} />
          : <div className="canvas-item-swatch" style={{ background: item.tone }} />}
      </div>

      {selected && (
        <>
          <button className="canvas-handle canvas-handle-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(item.uid)} aria-label="Remove item">
            <X size={12} />
          </button>
          <button className="canvas-handle canvas-handle-rotate" onPointerDown={startRotate} aria-label="Rotate">
            <RotateCw size={12} />
          </button>
          <button className="canvas-handle canvas-handle-resize" onPointerDown={startResize} aria-label="Resize">
            <Maximize2 size={11} />
          </button>
        </>
      )}
    </motion.div>
  );
}
