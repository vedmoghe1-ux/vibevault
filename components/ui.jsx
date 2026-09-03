"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X, Check } from "lucide-react";
import { ease } from "./motion";

export function Badge({ children, kind = "" }) {
  return <span className={`badge ${kind}`}>{children}</span>;
}

export function Field({ label, value, onChange, type = "text", area, options, ...rest }) {
  const [show, setShow] = useState(false);
  const id = useRef(`f${Math.random().toString(36).slice(2, 8)}`).current;
  const filled = String(value ?? "").length > 0;
  const isPass = type === "password";
  return (
    <div className="float">
      {options ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? o : o.label;
            return <option key={v} value={v} style={{ background: "#110E1A" }}>{l}</option>;
          })}
        </select>
      ) : area ? (
        <textarea id={id} value={value} data-filled={filled} onChange={(e) => onChange(e.target.value)} {...rest} />
      ) : (
        <input id={id} type={isPass && !show ? "password" : type === "password" ? "text" : type}
          value={value} data-filled={filled} onChange={(e) => onChange(e.target.value)} {...rest} />
      )}
      <label htmlFor={id}>{label}</label>
      {isPass && (
        <button type="button" onClick={() => setShow((s) => !s)} className="pw-toggle"
          aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}

export function Modal({ open, onClose, children, width = 620, label }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="sheet glass glass-hi" role="dialog" aria-modal="true" aria-label={label}
            style={{ maxWidth: width }}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.42, ease }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div className="toast"
          initial={{ opacity: 0, y: 22, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 12, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}>
          <Check size={16} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CloseButton({ onClose }) {
  return <button className="btn btn-quiet" onClick={onClose} aria-label="Close"><X size={18} /></button>;
}
