"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { SEED_FRIENDS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Field, Modal, CloseButton } from "./ui";
import { Magnetic } from "./motion";

const EMOJIS = ["🎉", "✈️", "🎓", "💍", "🏖️", "🎄", "🕺", "☕"];

export function GroupModal({ open, onClose }) {
  const { friendIds, createGroup } = useAura();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [members, setMembers] = useState([]);
  const friends = SEED_FRIENDS.filter((f) => friendIds.includes(f.id));

  const toggle = (id) => setMembers((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const ready = name.trim().length > 1;

  const submit = () => {
    createGroup({ name: name.trim(), emoji, memberIds: members });
    setName(""); setMembers([]); setEmoji(EMOJIS[0]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={520} label="Create a group">
      <div className="modal-body">
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize: 26 }}>New group</h2>
            <p className="muted modal-sub">For an occasion — a trip, a wedding, a night out. Share outfits and see what everyone's wearing.</p>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="stack">
          <Field label="Group name — e.g. Goa Trip 2026" value={name} onChange={setName} />

          <div>
            <p className="kicker" style={{ marginBottom: 8 }}>Pick an emoji</p>
            <div className="emoji-grid">
              {EMOJIS.map((e) => (
                <button key={e} className="emoji-pick" data-on={emoji === e} onClick={() => setEmoji(e)}>{e}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="kicker" style={{ marginBottom: 8 }}>Add friends {friends.length === 0 && "— you haven't added any yet"}</p>
            <div className="chips">
              {friends.map((f) => (
                <button key={f.id} className="chip" data-on={members.includes(f.id)} onClick={() => toggle(f.id)}>{f.handle}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <p className="kicker">{ready ? `${members.length} member${members.length === 1 ? "" : "s"} invited` : "Name your group to continue"}</p>
          <Magnetic>
            <button className="btn btn-solid" disabled={!ready} onClick={submit}>Create group <Check size={16} /></button>
          </Magnetic>
        </div>
      </div>
    </Modal>
  );
}
