"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, UserCheck, Plus, ChevronLeft, Share2 } from "lucide-react";
import { SEED_FRIENDS, OUTFITS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { ReactionButtons } from "@/components/reactions";
import { GroupModal } from "@/components/group-modal";
import { ShareOutfitModal } from "@/components/share-outfit-modal";
import { Page, ease } from "@/components/motion";

export default function Friends() {
  const { friendIds, toggleFriend, groups, shares, react } = useAura();
  const [q, setQ] = useState("");
  const [groupModal, setGroupModal] = useState(false);
  const [shareModal, setShareModal] = useState(null); // groupId or null
  const [openGroup, setOpenGroup] = useState(null);

  const filtered = SEED_FRIENDS.filter((f) =>
    q.trim().length < 1 || `${f.name} ${f.handle}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  if (openGroup) {
    const group = groups.find((g) => g.id === openGroup);
    const feed = shares.filter((s) => s.groupId === openGroup);
    return (
      <Page>
        <button className="btn btn-quiet" onClick={() => setOpenGroup(null)}><ChevronLeft size={16} /> All groups</button>
        <header className="head-split" style={{ marginTop: 16 }}>
          <div>
            <h1 className="h1" style={{ fontSize: "clamp(32px,5vw,48px)" }}>{group?.emoji} {group?.name}</h1>
            <p className="muted lede" style={{ fontSize: 15 }}>{group?.memberIds.length ?? 0} member{group?.memberIds.length === 1 ? "" : "s"} · rate every look someone drops in here</p>
          </div>
          <button className="btn btn-solid" onClick={() => setShareModal(openGroup)}><Share2 size={16} /> Share an outfit</button>
        </header>

        <div className="feed-list">
          {feed.map((s) => {
            const outfit = OUTFITS.find((o) => o.id === s.outfitId);
            if (!outfit) return null;
            const a = byId(outfit.aesthetic);
            return (
              <motion.div key={s.id} className="glass feed-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
                <span className="feed-swatch" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />
                <div className="feed-body">
                  <div>
                    <p className="feed-title">{outfit.title}</p>
                    <p className="kicker">{s.sharedBy} shared · {a.name}</p>
                  </div>
                  <ReactionButtons counts={s.reactions} onReact={(kind) => react(s.id, kind)} />
                </div>
              </motion.div>
            );
          })}
          {!feed.length && (
            <div className="glass empty">
              <p style={{ fontWeight: 600 }}>Nothing shared here yet.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>Drop the first outfit in and let the group rate it.</p>
            </div>
          )}
        </div>

        <ShareOutfitModal open={shareModal === openGroup} onClose={() => setShareModal(null)} groupId={openGroup} />
      </Page>
    );
  }

  return (
    <Page>
      <header style={{ maxWidth: "56ch" }}>
        <h1 className="h1">Friends</h1>
        <p className="muted lede">Add people, build a group for an occasion, and see what everyone's actually wearing before you decide.</p>
      </header>

      <div className="glass search" style={{ marginTop: 24, maxWidth: 420 }}>
        <Search size={17} className="muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or handle" aria-label="Search friends" />
      </div>

      <div className="friends-list">
        {filtered.map((f) => {
          const added = friendIds.includes(f.id);
          return (
            <div key={f.id} className="glass friend-row">
              <span className="friend-avatar" style={{ background: `linear-gradient(135deg, ${byId(f.vibes[0]).a1}, ${byId(f.vibes[0]).a2})` }}>
                {f.name[0]}
              </span>
              <div className="friend-info">
                <p style={{ fontWeight: 600, fontSize: 14.5 }}>{f.name}</p>
                <p className="kicker">{f.handle} · {f.vibes.map((v) => byId(v).name).join(", ")}</p>
              </div>
              <button className="btn btn-ghost btn-sm" data-on={added} onClick={() => toggleFriend(f.id)}>
                {added ? <><UserCheck size={14} /> Added</> : <><UserPlus size={14} /> Add</>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="section-head">
        <h2 style={{ fontSize: 22 }}>Your groups</h2>
        <button className="btn btn-ghost" onClick={() => setGroupModal(true)}><Plus size={16} /> New group</button>
      </div>

      <div className="grid-cards-sm">
        <AnimatePresence>
          {groups.map((g) => (
            <motion.button key={g.id} className="glass group-card" onClick={() => setOpenGroup(g.id)}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.35, ease }}>
              <span className="group-emoji">{g.emoji}</span>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{g.name}</p>
              <p className="kicker">{g.memberIds.length} member{g.memberIds.length === 1 ? "" : "s"}</p>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      {!groups.length && (
        <div className="glass empty">
          <p style={{ fontWeight: 600 }}>No groups yet.</p>
          <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>Start one for a trip, a wedding, anything — then share outfits and rate each other's picks.</p>
        </div>
      )}

      <GroupModal open={groupModal} onClose={() => setGroupModal(false)} />
    </Page>
  );
}
