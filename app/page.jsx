"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAura } from "@/lib/store";

export default function Root() {
  const { user, hydrated } = useAura();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    router.replace(user ? (user.vibes?.length ? "/for-you" : "/onboarding") : "/auth");
  }, [user, hydrated, router]);
  return null;
}
