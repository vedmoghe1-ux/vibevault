"use client";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, ArrowUpToLine, ArrowDownToLine, Check, Trash2, FolderOpen, X } from "lucide-react";
import { AESTHETICS } from "@/lib/data";
import { useAura } from "@/lib/store";
import { Avatar } from "@/components/avatar";
import { CanvasItem } from "@/components/canvas-item";
import { StudioSidebar } from "@/components/studio-sidebar";
import { Page, Magnetic } from "@/components/motion";

let uidCounter = 0;
const nextUid = () => `c${Date.now()}_${uidCounter++}`;

export default function Studio() {
  const { user, studios, saveStudio, deleteStudio } = useAura();
  const canvasRef = useRef(null);
  const [base, setBase] = useState("silhouette"); // silhouette | photo
  const [photo, setPhoto] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(user?.vibes?.slice(0, 2) ?? []);
  const [showLoad, setShowLoad] = useState(false);
  const fileRef = useRef(null);

  const addItem = useCallback((sourceItem, x = 50, y = 50) => {
    setItems((s) => {
      const z = s.length ? Math.max(...s.map((i) => i.z)) + 1 : 1;
      const uid = nextUid();
      const created = { uid, name: sourceItem.name, slot: sourceItem.slot, image: sourceItem.image, tone: sourceItem.tone, x, y, scale: 1, rotation: 0, z };
      setSelectedUid(uid);
      return [...s, created];
    });
  }, []);

  const updateItem = (uid, patch) => setItems((s) => s.map((i) => (i.uid === uid ? { ...i, ...patch } : i)));
  const deleteItem = (uid) => { setItems((s) => s.filter((i) => i.uid !== uid)); setSelectedUid(null); };

  const bringForward = () => {
    if (!selectedUid) return;
    setItems((s) => {
      const maxZ = Math.max(...s.map((i) => i.z));
      return s.map((i) => (i.uid === selectedUid ? { ...i, z: maxZ + 1 } : i));
    });
  };
  const sendBack = () => {
    if (!selectedUid) return;
    setItems((s) => {
      const minZ = Math.min(...s.map((i) => i.z));
      return s.map((i) => (i.uid === selectedUid ? { ...i, z: minZ - 1 } : i));
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    const sourceItem = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    addItem(sourceItem, x, y);
  };

  const uploadPhoto = async (file) => {
    if (!file) return;
    setBase("photo");
    setPhoto(URL.createObjectURL(file));
  };

const toggleTag = (id) => setTags((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = () => {
    saveStudio({
      id: `studio_${Date.now()}`,
      title: title.trim() || "Untitled look",
      tags,
      base, photo,
      items,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  };

  const load = (studio) => {
    setTitle(studio.title);
    setTags(studio.tags);
    setBase(studio.base);
    setPhoto(studio.photo);
    setItems(studio.items);
    setSelectedUid(null);
    setShowLoad(false);
  };

  const selected = items.find((i) => i.uid === selectedUid);

  return (
    <Page>
      <header className="head-split">
        <div style={{ maxWidth: "56ch" }}>
          <h1 className="h1">Studio Canvas</h1>
          <p className="muted lede">Build your own look — mix pieces across aesthetics, drag them into place, save it to your profile.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowLoad(true)}><FolderOpen size={16} /> My looks ({studios.length})</button>
      </header>

      <div className="studio-layout">
        <StudioSidebar onAdd={(it) => addItem(it)} />

        <div className="studio-main">
          <div className="studio-toolbar">
            <div className="studio-base-toggle">
              <button className="chip" data-on={base === "silhouette"} onClick={() => setBase("silhouette")}><User size={13} /> Silhouette</button>
              <button className="chip" data-on={base === "photo"} onClick={() => fileRef.current?.click()}><Upload size={13} /> Upload photo</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => uploadPhoto(e.target.files[0])} />
            </div>

            {selected && (
              <div className="studio-item-controls">
                <span className="kicker">{selected.name}</span>
                <button className="btn btn-ghost btn-sm" onClick={bringForward}><ArrowUpToLine size={13} /> Forward</button>
                <button className="btn btn-ghost btn-sm" onClick={sendBack}><ArrowDownToLine size={13} /> Back</button>
                <button className="btn btn-ghost btn-sm" onClick={() => deleteItem(selected.uid)}><Trash2 size={13} /></button>
              </div>
            )}
          </div>

          <div
            ref={canvasRef}
            className="studio-canvas glass"
            onClick={() => setSelectedUid(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {base === "photo" && photo
              ? <img src={photo} alt="Your base photo" className="studio-base-photo" />
              : (
                <div className="studio-base-avatar">
                  <Avatar
                    skin={user?.avatar?.skin ?? "#C68B59"}
                    hair={user?.avatar?.hair ?? "short"}
                    hairColor={user?.avatar?.hairColor ?? "#1B1512"}
                    items={[]}
                    size={100}
                  />
                </div>
              )}

            {items.map((it) => (
              <CanvasItem
                key={it.uid}
                item={it}
                selected={selectedUid === it.uid}
                canvasRef={canvasRef}
                onSelect={setSelectedUid}
                onChange={(patch) => updateItem(it.uid, patch)}
                onDelete={deleteItem}
              />
            ))}

            {!items.length && (
              <p className="studio-empty-hint">Click or drag a piece from the left to start building your look</p>
            )}
          </div>

          <div className="studio-save-row">
            <input className="studio-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name this look…" />
            <div className="chips">
              {AESTHETICS.map((a) => (
                <button key={a.id} className="chip" data-on={tags.includes(a.id)} onClick={() => toggleTag(a.id)} style={{ fontSize: 12.5, padding: "7px 12px" }}>
                  {a.name}
                </button>
              ))}
            </div>
            <Magnetic>
              <button className="btn btn-solid" onClick={save} disabled={!items.length}><Check size={16} /> Save to my profile</button>
            </Magnetic>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLoad && (
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setShowLoad(false)}>
            <motion.div className="sheet glass glass-hi" style={{ maxWidth: 560 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <div className="modal-body">
                <div className="modal-head">
                  <h2 style={{ fontSize: 24 }}>My saved looks</h2>
                  <button className="btn btn-quiet" onClick={() => setShowLoad(false)}><X size={18} /></button>
                </div>
                {studios.length ? (
                  <div className="studio-load-list">
                    {studios.map((st) => (
                      <div key={st.id} className="studio-load-row">
                        <button className="studio-load-name" onClick={() => load(st)}>{st.title}</button>
                        <button className="btn btn-quiet btn-sm" onClick={() => deleteStudio(st.id)}><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                ) : <p className="muted" style={{ fontSize: 14.5 }}>Nothing saved yet — build a look and hit Save.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
