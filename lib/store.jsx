"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SEED_LISTINGS, SEED_FRIENDS, AESTHETICS } from "./data";
import { CURRENCIES, formatMoney } from "./currency";

/* Single source of truth for session + user data.
   Swap the four localStorage effects for Supabase calls:
     auth      -> supabase.auth.signInWithPassword / signUp / signInWithOAuth
     profile   -> profiles table (vibes, budget, fit, height/weight/shoeSize)
     saves     -> saves table (user_id, outfit_id)
     friends   -> friends table (user_id, friend_id)
     groups    -> groups + group_members tables
     shares    -> shared_outfits table (group_id, outfit_id, shared_by, rating) */

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
  const [friendIds, setFriendIds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [shares, setShares] = useState([]);
  const [studios, setStudios] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setUser(s.user ?? null);
        setSaved(s.saved ?? []);
        if (s.listings) setListings(s.listings);
        if (s.currency) setCurrency(s.currency);
        setFriendIds(s.friendIds ?? []);
        setGroups(s.groups ?? []);
        setShares(s.shares ?? []);
        setStudios(s.studios ?? []);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ user, saved, listings, currency, friendIds, groups, shares, studios }));
  }, [user, saved, listings, currency, friendIds, groups, shares, studios, hydrated]);

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

  const toggleFriend = useCallback((id) => {
    setFriendIds((s) => {
      const has = s.includes(id);
      const friend = SEED_FRIENDS.find((f) => f.id === id);
      toastMsg(has ? `Removed ${friend?.handle ?? "friend"}` : `${friend?.handle ?? "Friend"} added`);
      return has ? s.filter((x) => x !== id) : [...s, id];
    });
  }, [toastMsg]);

  const createGroup = useCallback(({ name, emoji, memberIds }) => {
    const group = { id: `g${Date.now()}`, name, emoji, memberIds, createdAt: new Date().toISOString().slice(0, 10) };
    setGroups((s) => [group, ...s]);
    toastMsg(`${name} created`);
    return group.id;
  }, [toastMsg]);

  const shareOutfit = useCallback((groupId, outfitId) => {
    const share = { id: `s${Date.now()}`, groupId, outfitId, sharedBy: user?.name ?? "you", reactions: { fire: 0, neutral: 0, poop: 0 } };
    setShares((s) => [share, ...s]);
    toastMsg("Shared to the group");
  }, [toastMsg, user]);

  const react = useCallback((shareId, kind) => {
    setShares((s) => s.map((sh) => (sh.id === shareId
      ? { ...sh, reactions: { ...sh.reactions, [kind]: (sh.reactions?.[kind] ?? 0) + 1 } }
      : sh)));
  }, []);

  const saveStudio = useCallback((studio) => {
    setStudios((s) => {
      const exists = s.some((st) => st.id === studio.id);
      toastMsg(exists ? "Look updated" : "Look saved to your profile");
      return exists ? s.map((st) => (st.id === studio.id ? studio : st)) : [studio, ...s];
    });
  }, [toastMsg]);

  const deleteStudio = useCallback((id) => {
    setStudios((s) => s.filter((st) => st.id !== id));
    toastMsg("Look deleted");
  }, [toastMsg]);

  const theme = user?.vibes?.[0]
    ? AESTHETICS.find((a) => a.id === user.vibes[0])
    : AESTHETICS[0];

  const formatPrice = useCallback((usd) => formatMoney(usd, currency), [currency]);

  return (
    <Ctx.Provider value={{
      user, setUser, saved, toggleSave, listings, publish, promote,
      toast, toastMsg, hydrated,
      currency, setCurrency, currencies: CURRENCIES, formatPrice,
      friendIds, toggleFriend, groups, createGroup, shares, shareOutfit, react,
      studios, saveStudio, deleteStudio,
      themeVars: { "--a1": theme.a1, "--a2": theme.a2 },
    }}>
      {children}
    </Ctx.Provider>
  );
}
