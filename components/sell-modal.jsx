"use client";
import { useRef, useState } from "react";
import { Check, Image as ImageIcon } from "lucide-react";
import { AESTHETICS, CONDITIONS, byId } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Field, Modal, CloseButton } from "./ui";
import { Magnetic } from "./motion";

const EMPTY = { title: "", aesthetic: "streetwear", condition: "Very good", price: "", url: "", notes: "" };

export function SellModal({ open, onClose }) {
  const { user, publish } = useAura();
  const [f, setF] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const take = (file) => { if (file && file.type.startsWith("image/")) setImage(URL.createObjectURL(file)); };
  const ready = f.title.trim().length > 2 && Number(f.price) > 0;

  /* Supabase: upload `image` to storage, then insert into `listings`. */
  const submit = () => {
    setBusy(true);
    setTimeout(() => {
      publish({
        id: `l${Date.now()}`, title: f.title.trim(),
        seller: `@${(user?.name ?? "you").replace(/\s+/g, "").toLowerCase()}`,
        aesthetic: f.aesthetic, condition: f.condition, price: Number(f.price),
        url: f.url || "#", notes: f.notes, image, tone: byId(f.aesthetic).tone,
        promoted: false, mine: true, createdAt: new Date().toISOString().slice(0, 10),
      });
      setF(EMPTY); setImage(null); setBusy(false); onClose();
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} width={640} label="Create a listing">
      <div className="modal-body">
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize: 28 }}>List a piece</h2>
            <p className="muted modal-sub">Takes about a minute. You can promote it after it goes live.</p>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="drop" data-over={over} onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]); }}>
          {image ? (
            <div className="drop-filled">
              <img src={image} alt="Listing preview" />
              <div>
                <p style={{ fontWeight: 600 }}>Photo attached</p>
                <p className="kicker" style={{ marginTop: 4 }}>Click to swap it out</p>
              </div>
              <button className="btn btn-quiet" style={{ marginLeft: "auto" }}
                onClick={(e) => { e.stopPropagation(); setImage(null); }}>Remove</button>
            </div>
          ) : (
            <>
              <ImageIcon size={26} className="muted" />
              <p style={{ marginTop: 10, fontWeight: 600 }}>Drop a photo here</p>
              <p className="kicker" style={{ marginTop: 6 }}>Or click to browse. Daylight, plain wall, full garment.</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => take(e.target.files[0])} />
        </div>

        <div className="stack">
          <Field label="Title — what is it, and what size?" value={f.title} onChange={set("title")} />
          <div className="two">
            <Field label="Style category" value={f.aesthetic} onChange={set("aesthetic")}
              options={AESTHETICS.map((a) => ({ value: a.id, label: a.name }))} />
            <Field label="Condition" value={f.condition} onChange={set("condition")} options={CONDITIONS} />
          </div>
          <div className="two-uneven">
            <Field label="Price (USD)" value={f.price} onChange={set("price")} type="number" min="1" />
            <Field label="Checkout link (Depop, Vinted, your own)" value={f.url} onChange={set("url")} />
          </div>
          <Field label="Anything a buyer should know?" value={f.notes} onChange={set("notes")} area />
        </div>

        <div className="modal-foot">
          <p className="kicker" style={{ maxWidth: "38ch" }}>
            {ready ? "Goes live immediately in Thrift & Sell under your handle." : "Add a title and a price to publish."}
          </p>
          <Magnetic>
            <button className="btn btn-solid" disabled={!ready || busy} onClick={submit}>
              {busy ? "Publishing…" : "Publish listing"} <Check size={16} />
            </button>
          </Magnetic>
        </div>
      </div>
    </Modal>
  );
}
