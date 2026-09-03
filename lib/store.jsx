"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SEED_LISTINGS, AESTHETICS } from "./data";
import { CURRENCIES, formatMoney } from "./currency";

/* Single source of truth for session + user data.
   Swap the three localStorage effects for Supabase calls:
     auth      -> supabase.auth.signInWithPassword / signUp / signInWithOAuth
     profile   -> profiles table (vibes, budget, fit)
     saves     -> saves table (user_id, outfit_id)
     listings  -> listings table + realtime channel                          */

const Ctx = createContext(null);
export const useAura = () => useContext(Ctx);

const KEY = "aura.session.v1";

export function AuraProvider({ children }) {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [toast, setToastRaw] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setUser(s.user ?? null);
        setSaved(s.saved ?? []);
        if (s.listings) setListings(s.listings);
        if (s.currency) setCurrency(s.currency);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ user, saved, listings, currency }));
  }, [user, saved, listings, currency, hydrated]);

  const toastMsg = useCallback((msg) => {
    setToastRaw(msg);
    setTimeout(() => setToastRaw(null), 2600);
  }, []);

  const toggleSave = useCallback((id) => {
    setSaved((s) => {
      const has = s.includes(id);
      toastMsg(has ? "Removed from your vault" : "Saved to your vault");
      return has ? s.filter((x) => x !== id) : [...s, id];
    });
  }, [toastMsg]);

  const publish = useCallback((listing) => {
    setListings((s) => [listing, ...s]);
    toastMsg("Listing published");
  }, [toastMsg]);

  const promote = useCallback((id, tier) => {
    setListings((s) => s.map((l) => (l.id === id ? { ...l, promoted: true, tier } : l)));
  }, []);

  const theme = user?.vibes?.[0]
    ? AESTHETICS.find((a) => a.id === user.vibes[0])
    : AESTHETICS[0];

  const formatPrice = useCallback((usd) => formatMoney(usd, currency), [currency]);

  return (
    <Ctx.Provider value={{
      user, setUser, saved, toggleSave, listings, publish, promote,
      toast, toastMsg, hydrated,
      currency, setCurrency, currencies: CURRENCIES, formatPrice,
      themeVars: { "--a1": theme.a1, "--a2": theme.a2 },
    }}>
      {children}
    </Ctx.Provider>
  );
}
