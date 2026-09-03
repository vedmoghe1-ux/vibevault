"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Compass, Store, Bookmark, LogOut, Search, Tag, User, X } from "lucide-react";
import { useState } from "react";
import { useAura } from "@/lib/store";

export const NAV = [
  { href: "/for-you", label: "For you", icon: Sparkles },
  { href: "/vault", label: "Style vault", icon: Compass },
  { href: "/market", label: "Thrift & sell", icon: Store },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Rail() {
  const path = usePathname();
  const router = useRouter();
  const { setUser } = useAura();
  const on = (href) => path === href || path.startsWith(href + "/");

  return (
    <>
      <nav className="rail" aria-label="Main">
        <div className="rail-mark"><Sparkles size={20} className="accent" /></div>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="rail-btn" data-on={on(href)} aria-label={label}>
            <Icon size={20} /><span className="rail-tip">{label}</span>
          </Link>
        ))}
        <button className="rail-btn rail-last" aria-label="Log out"
          onClick={() => { setUser(null); router.push("/auth"); }}>
          <LogOut size={19} /><span className="rail-tip">Log out</span>
        </button>
      </nav>

      <nav className="dock" aria-label="Main">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="rail-btn" data-on={on(href)} aria-label={label}>
            <Icon size={20} />
          </Link>
        ))}
      </nav>
    </>
  );
}

export function TopBar({ onSell }) {
  const { user } = useAura();
  const [q, setQ] = useState("");
  const router = useRouter();
  const submit = (e) => { e.preventDefault(); if (q.trim().length > 1) router.push(`/vault?q=${encodeURIComponent(q.trim())}`); };

  return (
    <div className="topbar">
      <form className="glass search" onSubmit={submit}>
        <Search size={17} className="muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search"
          placeholder="Search looks, brands, or pieces" />
        {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="muted"><X size={16} /></button>}
      </form>
      <button className="btn btn-ghost" onClick={onSell}><Tag size={16} /> Sell a piece</button>
      <Link href="/saved" className="chip"><User size={15} /> {user?.name ?? "guest"}</Link>
    </div>
  );
}
