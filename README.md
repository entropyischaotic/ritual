# ritual

a dark local-first digital altar for attention, reflection, sky study, and grounding.

ritual treats mystical language with care and clear edges. tarot is a mirror, astrology is a cultural symbol system, astronomy is physical science, and ritual is a practical way to shape attention, memory, sensation, and transition.

created by isa 🐰

## begin

```bash
npm install
npm run dev
```

open `http://localhost:3000`.

use `npm run typecheck` for strict types and `npm run build` for a production check.

## rooms

- `altar` — a movable cabinet of original code-drawn ritual objects
- `cosmo lab` — moon phase physics, seasonal moon notes, and a celestial library
- `tarot` — one-card and three-card reflection with the 22 major arcana
- `symbolic science` — pattern, myth, archetype, and meaning-making
- `ritual physics` — attention, habit cues, sensation, memory, and transition
- `inner apothecary` — favorite objects, intentions, and short grounding rituals
- `nervous system alchemy` — gentle brain and body education
- `grimoire` — intentions, pulls, reflections, rituals, favorites, and notes

## project map

```text
app/
  data.ts              object, tarot, celestial, and ritual writing
  globals.css          visual system, object styling, and responsive states
  layout.tsx           document shell, mobile metadata, and icon links
  manifest.ts          pwa manifest
  page.tsx             application entry
  types.ts             shared state types
  lib/
    moon.ts            client-side lunar approximation and seasonal moon notes
    storage.ts         local state and persistence
components/
  Modal.tsx            animated dialog foundation
  ObjectArt.tsx        original svg altar object set
  RitualApp.tsx        navigation, altar, rooms, and interactions
public/
  icons/               original pwa install icons
```

## local storage

the complete altar and grimoire state is stored under `ritual-state-v1` in the current browser. there is no account, server, tracker, or remote database. when browser storage is unavailable, ritual keeps working in memory for the current session.

resetting the altar does not erase grimoire entries.

to begin completely fresh, remove the `ritual-state-v1` key from browser storage.

## deploy on vercel

1. push the project to a git repository.
2. import the repository in vercel.
3. keep the default framework preset as `next.js`.
4. leave build command as `npm run build`.
5. deploy.

vercel serves the app over https, which is required for reliable home-screen installation on phones.

## install on a phone

on ios safari:

1. open the deployed site.
2. tap share.
3. choose add to home screen.
4. keep the name `ritual` and add it.

on android chrome:

1. open the deployed site.
2. tap the browser menu.
3. choose install app or add to home screen.
4. keep the name `ritual` and add it.

ritual has a manifest and icons, but it does not use push notifications.

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

created by isa
