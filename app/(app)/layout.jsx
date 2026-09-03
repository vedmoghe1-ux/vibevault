"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Rail, TopBar } from "@/components/nav";
import { SellModal } from "@/components/sell-modal";
import { PricingModal } from "@/components/pricing-modal";
import { Toast } from "@/components/ui";
import { useAura } from "@/lib/store";

const Chrome = createContext(null);
export const useChrome = () => useContext(Chrome);

export default function AppLayout({ children }) {
  const { user, hydrated, themeVars, toast } = useAura();
  const router = useRouter();
  const [sell, setSell] = useState(false);
  const [pricing, setPricing] = useState(undefined); // undefined = closed, null = generic

  useEffect(() => {
    if (hydrated && !user) router.replace("/auth");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  return (
    <Chrome.Provider value={{ openSell: () => setSell(true), openPricing: (l = null) => setPricing(l) }}>
      <div style={themeVars}>
        <Rail />
        <div className="shell">
          <div className="page">
            <TopBar onSell={() => setSell(true)} />
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>
        </div>
        <SellModal open={sell} onClose={() => setSell(false)} />
        <PricingModal open={pricing !== undefined} target={pricing} onClose={() => setPricing(undefined)} />
        <Toast message={toast} />
      </div>
    </Chrome.Provider>
  );
}
