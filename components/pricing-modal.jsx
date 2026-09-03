"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Zap, Crown } from "lucide-react";
import { TIERS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Modal, Badge, CloseButton } from "./ui";
import { Magnetic, ease } from "./motion";

export function PricingModal({ open, onClose, target }) {
  const [pick, setPick] = useState("blaze");
  const { promote, toastMsg, formatPrice } = useAura();

  /* Supabase: create a `promotions` row + a Stripe checkout session. */
  const confirm = () => {
    const tier = TIERS.find((t) => t.id === pick);
    if (target) { promote(target.id, pick); toastMsg(`Promoted with ${tier.name}`); }
    else toastMsg(`${tier.name} selected — list an item to apply it`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={880} label="Promotion pricing">
      <div className="modal-body">
        <div className="modal-head">
          <div style={{ maxWidth: "48ch" }}>
            <h2 style={{ fontSize: 28 }}>Put it in front of the right feed</h2>
            <p className="muted modal-sub">
              {target ? `Promoting “${target.title}”.` : "Promotions run on the style tag you listed under, so it reaches people already browsing that aesthetic."} Every promoted item stays visibly marked.
            </p>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="tiers">
          {TIERS.map((t) => {
            const on = pick === t.id;
            const Icon = { zap: Zap, flame: Flame, crown: Crown }[t.icon];
            return (
              <motion.button key={t.id} className="glass tier" data-on={on} onClick={() => setPick(t.id)}
                animate={{ y: on ? -4 : 0 }} transition={{ duration: 0.3, ease }}>
                <div className="tier-top">
                  <Icon size={19} className="accent" />
                  {t.popular && <Badge kind="badge-hot">Most picked</Badge>}
                </div>
                <h3 style={{ fontSize: 22, marginTop: 14 }}>{t.name}</h3>
                <p className="display tabular tier-price">{formatPrice(t.price)}</p>
                <p className="kicker" style={{ marginTop: 4 }}>for {t.days} days</p>
                <hr className="hair" style={{ margin: "16px 0" }} />
                <ul className="tier-list">
                  {t.lines.map((l) => <li key={l}><Check size={14} className="accent" /> {l}</li>)}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <div className="modal-foot">
          <p className="kicker" style={{ maxWidth: "42ch" }}>No auto-renewal. If a promoted item doesn't sell within its run, Blaze and Icon include a free re-list.</p>
          <Magnetic>
            <button className="btn btn-solid" onClick={confirm}>
              <Flame size={16} /> {target ? `Promote for ${formatPrice(TIERS.find((t) => t.id === pick).price)}` : "Choose this tier"}
            </button>
          </Magnetic>
        </div>
      </div>
    </Modal>
  );
}
