"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader } from "lucide-react";
import { AESTHETICS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Field } from "@/components/ui";
import { Magnetic, ease } from "@/components/motion";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { setUser, themeVars } = useAura();
  const router = useRouter();

  /* Supabase: replace with supabase.auth.signUp / signInWithPassword. */
  const finish = (profile, isNew) => {
    setUser(profile);
    router.push(isNew ? "/onboarding" : "/for-you");
  };

  const submit = () => {
    if (!email.includes("@") || pw.length < 6) return setErr("Use a real email and a password of at least 6 characters.");
    setErr(""); setBusy(true);
    setTimeout(() => finish({
      name: name.trim() || email.split("@")[0], email,
      vibes: mode === "login" ? ["clean-girl", "streetwear", "y2k"] : [],
      budget: "Mid ($80–200)", fit: [],
    }, mode === "signup"), 700);
  };

  const social = (provider) => {
    setBusy(true);
    setTimeout(() => finish({ name: "vibecheck.friend", email: `demo@${provider}.mock`, vibes: [], budget: "Mid ($80–200)", fit: [] }, true), 700);
  };

  return (
    <main className="auth" style={themeVars}>
      <div className="auth-col">
        <div className="brand"><Sparkles size={20} className="accent" /><span className="display brand-word">vibecheck</span></div>

        <div className="auth-form">
          <h1 className="auth-h1">{mode === "signup" ? "Find the clothes that already sound like you." : "Back to the vault."}</h1>
          <p className="muted auth-lede">
            {mode === "signup"
              ? "Pick a few aesthetics, and the feed rebuilds itself around them. Every look breaks down into pieces you can actually buy."
              : "Your saved looks, your sellers, your feed — exactly where you left them."}
          </p>

          <div className="stack">
            {mode === "signup" && <Field label="What should we call you?" value={name} onChange={setName} autoComplete="name" />}
            <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
            <Field label="Password" value={pw} onChange={setPw} type="password" autoComplete="current-password" />
          </div>

          {err && <p className="err">{err}</p>}

          <div className="auth-actions">
            <Magnetic>
              <button className="btn btn-solid" onClick={submit} disabled={busy}>
                {busy ? <Loader size={17} className="spin" /> : <Sparkles size={17} />}
                {mode === "signup" ? "Create my vault" : "Log in"}
              </button>
            </Magnetic>
            <button className="btn btn-quiet" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(""); }}>
              {mode === "signup" ? "I already have an account" : "Make a new account"}
            </button>
          </div>

          <div className="divider"><hr className="hair" /><span className="kicker">or continue with</span><hr className="hair" /></div>

          <div className="social">
            {["Google", "Apple", "Discord"].map((p) => (
              <button key={p} className="btn btn-ghost" onClick={() => social(p.toLowerCase())} disabled={busy}>{p}</button>
            ))}
          </div>
          <p className="kicker" style={{ marginTop: 16 }}>Social sign-in is mocked — wire it to supabase.auth.signInWithOAuth.</p>
        </div>

        <p className="kicker">VibeCheck · a style vault, not another shopping tab</p>
      </div>

      <AuthArt />
    </main>
  );
}

function AuthArt() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % AESTHETICS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const a = AESTHETICS[i];
  return (
    <div className="glass auth-art">
      <motion.div className="auth-art-bg" animate={{ opacity: 1 }}
        style={{ background: `radial-gradient(70% 60% at 30% 20%, ${a.a1}55, transparent 70%), radial-gradient(60% 60% at 75% 80%, ${a.a2}44, transparent 70%), ${a.tone}`, transition: "background 1.1s ease" }} />
      <div className="grain" />
      <div className="auth-art-body">
        <p className="kicker">currently trending in the vault</p>
        <AnimatePresence mode="wait">
          <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
            <h2 className="auth-art-h2">{a.name}</h2>
            <p className="auth-art-p">{a.tagline}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="dots">
        {AESTHETICS.map((x, n) => <span key={x.id} data-on={n === i} />)}
      </div>
    </div>
  );
}
