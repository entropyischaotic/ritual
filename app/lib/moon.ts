import type { MoonData } from "../types";

const phases = [
  [1.8457, "new moon", "beginnings, quiet, and intention-setting"],
  [5.5369, "waxing crescent", "building, planning, and one small effort"],
  [9.2281, "first quarter", "friction, decision, and action"],
  [12.9193, "waxing gibbous", "refinement, adjustment, and patience"],
  [16.6105, "full moon", "visibility, culmination, and reflection"],
  [20.3017, "waning gibbous", "sharing, gratitude, and integration"],
  [23.9929, "last quarter", "release, evaluation, and course correction"],
  [27.6841, "waning crescent", "rest, closure, and recovery"],
  [29.5306, "new moon", "beginnings, quiet, and intention-setting"],
] as const;

export function getMoonData(date = new Date()): MoonData {
  // a known new moon anchors a simple synodic-month approximation.
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - knownNewMoon) / 86_400_000;
  const age = ((days % 29.53058867) + 29.53058867) % 29.53058867;
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / 29.53058867)) / 2) * 100);
  const [, name, theme] = phases.find(([limit]) => age < limit) ?? phases[0];
  return {
    name,
    illumination,
    direction: age < 14.765 ? "waxing" : "waning",
    age,
    prompt: `where might ${theme} belong in your life today?`,
  };
}
