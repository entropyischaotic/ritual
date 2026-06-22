"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.div role="dialog" aria-modal="true" className={`modal-card ${wide ? "modal-wide" : ""}`} initial={{ opacity: 0, y: 22, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .25 }} onMouseDown={(event) => event.stopPropagation()}>
      <button className="icon-button modal-close" aria-label="close" onClick={onClose}><X size={16}/></button>
      {children}
    </motion.div>
  </motion.div>}</AnimatePresence>;
}
