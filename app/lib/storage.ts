"use client";

import { useCallback, useEffect, useState } from "react";
import type { GrimoireEntry, ObjectKind, PlacedObject, RitualState } from "../types";

const key = "ritual-state-v1";
const starterAltar: PlacedObject[] = [
  { id: "starter-candle", kind: "candle", x: 49, y: 50 },
  { id: "starter-lavender", kind: "dried lavender", x: 24, y: 61 },
  { id: "starter-mirror", kind: "gothic mirror", x: 72, y: 31 },
  { id: "starter-book", kind: "grimoire", x: 65, y: 70 },
];

const initialState: RitualState = { altar: starterAltar, entries: [], favorites: [], onboarded: false };

export function useRitualState() {
  const [state, setState] = useState<RitualState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) setState({ ...initialState, ...JSON.parse(saved) });
    } catch {
      // private browsing and restricted storage still get an in-memory session.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // state remains available for this session if persistence is unavailable.
    }
  }, [state, ready]);

  const addObject = useCallback((kind: ObjectKind) => setState((s) => ({
    ...s,
    altar: [...s.altar, { id: crypto.randomUUID(), kind, x: 40 + Math.random() * 20, y: 40 + Math.random() * 25 }],
  })), []);

  const updateObject = useCallback((id: string, patch: Partial<PlacedObject>) => setState((s) => ({
    ...s, altar: s.altar.map((item) => item.id === id ? { ...item, ...patch } : item),
  })), []);

  const removeObject = useCallback((id: string) => setState((s) => ({ ...s, altar: s.altar.filter((item) => item.id !== id) })), []);
  const addEntry = useCallback((entry: GrimoireEntry) => setState((s) => ({ ...s, entries: [entry, ...s.entries] })), []);
  const updateEntry = useCallback((id: string, patch: Partial<GrimoireEntry>) => setState((s) => ({ ...s, entries: s.entries.map((entry) => entry.id === id ? { ...entry, ...patch } : entry) })), []);
  const deleteEntry = useCallback((id: string) => setState((s) => ({ ...s, entries: s.entries.filter((entry) => entry.id !== id) })), []);
  const toggleFavorite = useCallback((kind: ObjectKind) => setState((s) => ({ ...s, favorites: s.favorites.includes(kind) ? s.favorites.filter((item) => item !== kind) : [...s.favorites, kind] })), []);
  const resetAltar = useCallback(() => setState((s) => ({ ...s, altar: starterAltar })), []);
  const finishOnboarding = useCallback(() => setState((s) => ({ ...s, onboarded: true })), []);

  return { state, ready, addObject, updateObject, removeObject, addEntry, updateEntry, deleteEntry, toggleFavorite, resetAltar, finishOnboarding };
}
