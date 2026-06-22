# ritual

a dark, local-first digital altar for attention, reflection, sky study, and grounding.

ritual treats mystical practices with care and clear boundaries. tarot is a reflective mirror, astrology is a cultural symbol system, astronomy is physical science, and ritual is a practical way to shape attention, memory, and transition.

## begin

```bash
npm install
npm run dev
```

open `http://localhost:3000`.

use `npm run typecheck` for strict types and `npm run build` for a production check.

## rooms

- `altar` — a movable collection of original, code-drawn ritual objects
- `cosmo lab` — current moon phase, lunar science, and a celestial library
- `tarot` — a one-card reflection using the 22 major arcana
- `symbolic science` — pattern, myth, archetype, and meaning-making
- `ritual physics` — attention, habit cues, sensation, memory, and transition
- `inner apothecary` — favorite objects, intentions, and short grounding rituals
- `nervous system alchemy` — gentle brain and body education
- `grimoire` — intentions, pulls, reflections, rituals, and notes

## project map

```text
app/
  data.ts              object, tarot, celestial, and ritual writing
  globals.css          complete visual system and responsive states
  layout.tsx           document shell and metadata
  page.tsx             application entry
  types.ts             shared state types
  lib/
    moon.ts            client-side lunar approximation
    storage.ts         local state and persistence
components/
  Modal.tsx             animated dialog foundation
  ObjectArt.tsx         original svg altar object set
  RitualApp.tsx         navigation, altar, rooms, and interactions
```

## local storage

the complete altar and grimoire state is stored under `ritual-state-v1` in the current browser. there is no account, server, tracker, or remote database. when browser storage is unavailable, ritual keeps working in memory for the current session. resetting the altar does not erase grimoire entries.

to start completely fresh, remove the `ritual-state-v1` key from browser storage.

## later

- supabase auth
- cloud-saved altars
- custom uploaded altar images
- shareable altar screenshots
- more altar object packs
- expanded moon calculations
- expanded constellation library
- optional ai reflection assistant, framed as journaling support only
- paid cosmetic themes, not paid spiritual claims

created by isa 🐇
