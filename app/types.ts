export type Section = "altar" | "cosmo lab" | "tarot" | "symbolic science" | "ritual physics" | "inner apothecary" | "nervous system alchemy" | "grimoire";

export type EntryType = "intention" | "tarot" | "note" | "moon reflection" | "grounding ritual" | "favorite object";

export interface GrimoireEntry {
  id: string;
  type: EntryType;
  title: string;
  body: string;
  createdAt: string;
  moonPhase: string;
  mood?: string;
  meta?: string;
}

export interface PlacedObject {
  id: string;
  kind: ObjectKind;
  x: number;
  y: number;
  note?: string;
  active?: boolean;
}

export type ObjectKind = "candle" | "incense holder" | "crystal" | "dried lavender" | "herb jar" | "moon water" | "tarot deck" | "grimoire" | "framed image" | "silver key" | "gothic mirror" | "wax seal" | "constellation charm" | "potion bottle" | "flower stem" | "bunny charm";

export interface RitualState {
  altar: PlacedObject[];
  entries: GrimoireEntry[];
  favorites: ObjectKind[];
  onboarded: boolean;
}

export interface MoonData {
  name: string;
  illumination: number;
  direction: "waxing" | "waning";
  age: number;
  prompt: string;
}
