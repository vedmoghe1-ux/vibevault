"use client";
import { OUTFITS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Modal, CloseButton } from "./ui";

export function ShareOutfitModal({ open, onClose, groupId }) {
  const { shareOutfit, user } = useAura();
  const preferred = (user?.vibes ?? []);
  const ordered = [...OUTFITS].sort((a, b) => preferred.includes(b.aesthetic) - preferred.includes(a.aesthetic));

  const pick = (outfitId) => { shareOutfit(groupId, outfitId); onClose(); };

  return (
    <Modal open={open} onClose={onClose} width={640} label="Share an outfit">
      <div className="modal-body">
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize: 26 }}>Share a look</h2>
            <p className="muted modal-sub">Pick one from the vault to drop into this group.</p>
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <div className="share-grid">
          {ordered.slice(0, 12).map((o) => {
            const a = byId(o.aesthetic);
            return (
              <button key={o.id} className="share-item" onClick={() => pick(o.id)}>
                <span className="share-swatch" style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }} />
                <span className="share-name">{o.title}</span>
                <span className="kicker">{a.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
