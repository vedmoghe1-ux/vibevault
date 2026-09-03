"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import { AESTHETICS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Magnetic, ease } from "@/components/motion";

const BUDGETS = ["Thrift-first (under $80)", "Mid ($80–200)", "Investment ($200+)", "Mixed — depends on the piece"];
const FITS = ["Oversized", "Tailored", "Cropped", "Layered", "Body-skimming", "Long line"];

export default function Onboarding() {
  const { user, setUser } = useAura();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [vibes, setVibes] = useState(user?.vibes ?? []);
  const [budget, setBudget] = useState(user?.budget ?? BUDGETS[1]);
  const [fit, setFit] = useState(user?.fit ?? []);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const save = (prefs) => {
    setUser({ ...(user ?? { name: "guest", email: "" }), ...prefs });
    router.push("/for-you");
  };

  const steps = [
    { title: "What's your core vibe?", sub: "Pick at least two. This is what the For You feed is built from.", ok: vibes.length >= 2 },
    { title: "Where do you usually spend?", sub: "We hide the pieces that are wildly out of range.", ok: true },
    { title: "How do you like things to fit?", sub: "Optional, but it sharpens the recommendations.", ok: true },
  ];
  const cur = steps[step];
  const lead = vibes[0] ? byId(vibes[0]) : AESTHETICS[0];

  return (
    <main className="onboard" style={{ "--a1": lead.a1, "--a2": lead.a2 }}>
      <div className="glass glass-hi onboard-card">
        <div className="onboard-head">
          <span className="kicker">Step {step + 1} of 3 · welcome, {user?.name ?? "friend"}</span>
          <button className="btn btn-quiet" onClick={() => save({ vibes: vibes.length ? vibes : ["clean-girl", "streetwear"], budget, fit })}>
            Skip for now
          </button>
        </div>

        <div className="meter"><motion.i animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.35, ease }}>
            <h2 className="onboard-h2">{cur.title}</h2>
            <p className="muted onboard-sub">{cur.sub}</p>

            <motion.div className="chips" layout>
              {step === 0 && AESTHETICS.map((a) => (
                <motion.button layout key={a.id} className="chip chip-lg" data-on={vibes.includes(a.id)}
                  whileTap={{ scale: 0.93 }} onClick={() => toggle(vibes, setVibes, a.id)}>
                  <span className="chip-dot" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />{a.name}
                </motion.button>
              ))}
              {step === 1 && BUDGETS.map((b) => (
                <motion.button layout key={b} className="chip chip-lg" data-on={budget === b} whileTap={{ scale: 0.93 }} onClick={() => setBudget(b)}>{b}</motion.button>
              ))}
              {step === 2 && FITS.map((f) => (
                <motion.button layout key={f} className="chip chip-lg" data-on={fit.includes(f)} whileTap={{ scale: 0.93 }} onClick={() => toggle(fit, setFit, f)}>{f}</motion.button>
              ))}
            </motion.div>

            {step === 0 && vibes.length > 0 && (
              <p className="muted read">
                {vibes.length === 1 ? "One more and the feed can start balancing between them." : `Reading you as ${vibes.map((v) => byId(v).name).join(" × ")}.`}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="onboard-foot">
          <button className="btn btn-quiet" style={{ visibility: step ? "visible" : "hidden" }} onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
          <Magnetic>
            <button className="btn btn-solid" disabled={!cur.ok}
              onClick={() => (step === 2 ? save({ vibes, budget, fit }) : setStep((s) => s + 1))}>
              {step === 2 ? "Open my vault" : "Continue"} <Check size={16} />
            </button>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
