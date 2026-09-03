"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Rail, TopBar } from "@/components/nav";
import { Toast } from "@/components/ui";
import { useAura } from "@/lib/store";

export default function AppLayout({ children }) {
  const { user, hydrated, themeVars, toast } = useAura();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/auth");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  return (
    <div style={themeVars}>
      <Rail />
      <div className="shell">
        <div className="page">
          <TopBar />
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}
