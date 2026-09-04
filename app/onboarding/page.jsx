"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Sparkles, Flame } from "lucide-react";
import { AESTHETICS, byId, BUDGET_TIERS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Magnetic, ease } from "@/components/motion";

const FITS = ["Oversized", "Tailored", "Cropped", "Layered", "Body-skimming", "Long line"];

const HYPE = [
  "Pick a couple to get started.",
  "One more and the feed can start balancing between them.",
  (names) => `Reading you as ${names}. Feed's already warming up.`,
  (names) => `${names} — okay, this is a whole personality now.`,
  (names) => `${names}. We might know you better than your group chat does.`,
];

export default function Onboarding() {
  const { user, setUser } = useAura();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [vibes, setVibes] = useState(user?.vibes ?? []);
  const [budgetId, setBudgetId] = useState(
    BUDGET_TIERS.find((b) => b.name === user?.budget)?.id ?? "main"
  );
  const [fit, setFit] = useState(user?.fit ?? []);
  const [height, setHeight] = useState(user?.height ?? "");
  const [weight, setWeight] = useState(user?.weight ?? "");
  const [shoeSize, setShoeSize] = useState(user?.shoeSize ?? "");
  const [launching, setLaunching] = useState(false);

  const toggleFit = (v) => setFit((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const pickVibe = (id) => setVibes((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const finish = (prefs) => {
    setUser({ ...(user ?? { name: "guest", email: "" }), ...prefs });
    setLaunching(true);
    setTimeout(() => router.push("/for-you"), 480);
  };
  const budgetName = BUDGET_TIERS.find((b) => b.id === budgetId)?.name ?? BUDGETS[1].name;

  const steps = [
    { title: "What's your core vibe?", sub: "Pick at least two. This is what the For You feed is built from.", ok: vibes.length >= 2 },
    { title: "Where do you usually spend?", sub: "We hide the pieces that are wildly out of range.", ok: true },
    { title: "How do you like things to fit?", sub: "Optional, but it sharpens the recommendations.", ok: true },
    { title: "Your sizes, once and for all", sub: "Enter these now and you'll never have to type them again on this device.", ok: true },
  ];
  const cur = steps[step];
  const lead = vibes[0] ? byId(vibes[0]) : AESTHETICS[0];
  const names = vibes.map((v) => byId(v).name).join(" × ");
  const hypeIdx = Math.min(vibes.length, HYPE.length - 1);
  const hypeLine = typeof HYPE[hypeIdx] === "function" ? HYPE[hypeIdx](names) : HYPE[hypeIdx];

  return (
    <main className="onboard" style={{ "--a1": lead.a1, "--a2": lead.a2 }}>
      <AnimatePresence>
        {launching && (
          <motion.div className="launch-flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: `radial-gradient(circle at 50% 50%, ${lead.a1}, ${lead.a2})` }} />
        )}
      </AnimatePresence>

      <motion.div className="glass glass-hi onboard-card" animate={launching ? { scale: 1.04, opacity: 0 } : { scale: 1, opacity: 1 }} transition={{ duration: 0.45, ease }}>
        <div className="onboard-head">
          <span className="kicker">Step {step + 1} of {steps.length} · welcome, {user?.name ?? "friend"}</span>
          <button className="btn btn-quiet" onClick={() => finish({ vibes: vibes.length ? vibes : ["clean-girl", "streetwear"], budget: budgetName, budgetId, fit, height, weight, shoeSize })}>
            Skip for now
          </button>
        </div>

        <div className="meter meter-glow"><motion.i animate={{ width: `${((step + 1) / steps.length) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.35, ease }}>
            <div className="onboard-title-row">
              <h2 className="onboard-h2">{cur.title}</h2>
              {step === 0 && vibes.length > 0 && (
                <motion.span className="vibe-count" key={vibes.length}
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 16 }}>
                  {vibes.length} picked
                </motion.span>
              )}
            </div>
            <p className="muted onboard-sub">{cur.sub}</p>

            {step === 0 && (
              <motion.div className="chips" layout>
                {AESTHETICS.map((a) => (
                  <VibeChip key={a.id} a={a} on={vibes.includes(a.id)} onPick={() => pickVibe(a.id)} />
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <div className="budget-grid">
                {BUDGET_TIERS.map((b) => (
                  <motion.button key={b.id} className="budget-card" data-on={budgetId === b.id} data-popular={b.popular}
                    whileTap={{ scale: 0.96 }} onClick={() => setBudgetId(b.id)}
                    animate={b.popular && budgetId !== b.id ? { boxShadow: ["0 0 0 rgba(255,111,165,0)", "0 0 26px rgba(255,111,165,.35)", "0 0 0 rgba(255,111,165,0)"] } : {}}
                    transition={b.popular ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}>
                    {b.popular && <span className="budget-badge"><Flame size={12} /> Most picked</span>}
                    <span className="budget-emoji">{b.emoji}</span>
                    <span className="budget-name">{b.name}</span>
                    <span className="budget-range tabular">{b.range}</span>
                    {budgetId === b.id && (
                      <motion.span className="budget-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                        <Check size={14} />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 2 && (
              <motion.div className="chips" layout>
                {FITS.map((f) => (
                  <motion.button layout key={f} className="chip chip-lg" data-on={fit.includes(f)} whileTap={{ scale: 0.93 }} onClick={() => toggleFit(f)}>{f}</motion.button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <div className="size-grid">
                <div className="float">
                  <input type="number" inputMode="numeric" value={height} data-filled={String(height).length > 0}
                    onChange={(e) => setHeight(e.target.value)} placeholder=" " />
                  <label>Height (cm)</label>
                </div>
                <div className="float">
                  <input type="number" inputMode="numeric" value={weight} data-filled={String(weight).length > 0}
                    onChange={(e) => setWeight(e.target.value)} placeholder=" " />
                  <label>Weight (kg)</label>
                </div>
                <div className="float">
                  <input type="number" inputMode="numeric" step="0.5" value={shoeSize} data-filled={String(shoeSize).length > 0}
                    onChange={(e) => setShoeSize(e.target.value)} placeholder=" " />
                  <label>Shoe size (UK)</label>
                </div>
              </div>
            )}


            {step === 0 && (
              <AnimatePresence mode="wait">
                <motion.p key={hypeIdx + (vibes.length > 0 ? "on" : "off")} className="muted read"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {hypeLine}
                </motion.p>
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="onboard-foot">
          <button className="btn btn-quiet" style={{ visibility: step ? "visible" : "hidden" }} onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
          <Magnetic>
            <button className="btn btn-solid" disabled={!cur.ok}
              onClick={() => (step === steps.length - 1 ? finish({ vibes, budget: budgetName, budgetId, fit, height, weight, shoeSize }) : setStep((s) => s + 1))}>
              {step === steps.length - 1 ? "Open my vault" : "Continue"} <Sparkles size={16} />
            </button>
          </Magnetic>
        </div>
      </motion.div>
    </main>
  );
}

/* A vibe chip that pops a small sparkle burst the moment it's picked —
   the "reward" beat that makes selecting feel worth doing again. */
function VibeChip({ a, on, onPick }) {
  const [burst, setBurst] = useState(0);
  return (
    <span className="vibe-chip-wrap">
      <motion.button layout className="chip chip-lg vibe-chip" data-on={on} whileTap={{ scale: 0.9 }}
        onClick={() => { onPick(); if (!on) setBurst((b) => b + 1); }}>
        <span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />
        <span className="vibe-chip-text">
          <span>{a.name}</span>
          <span className="vibe-chip-promise">{a.promise}</span>
        </span>
      </motion.button>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span key={burst} className="chip-spark" style={{ color: a.a2 }}
            initial={{ opacity: 1, scale: 0.3, y: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -18, rotate: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => setBurst(0)}>
            <Sparkles size={16} fill="currentColor" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
