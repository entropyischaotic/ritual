import type { MoonData } from "../types";

const phases = [
  [1.8457, "new moon", "beginnings, quiet, and intention-setting", "the moon sits roughly sunward from earth, so the bright side faces mostly away from us."],
  [5.5369, "waxing crescent", "building, planning, and one small effort", "a thin slice of the sunlit half becomes visible as the moon moves eastward around earth."],
  [9.2281, "first quarter", "friction, decision, and action", "we see about half of the lunar disk lit because the moon is near a right angle from the sun in our sky."],
  [12.9193, "waxing gibbous", "refinement, adjustment, and patience", "most of the sunlit half is now visible, but the moon has not reached opposition yet."],
  [16.6105, "full moon", "visibility, culmination, and reflection", "earth is roughly between sun and moon, so the moon faces us with its illuminated side."],
  [20.3017, "waning gibbous", "sharing, gratitude, and integration", "the visible lit portion begins shrinking after full moon as the viewing angle changes."],
  [23.9929, "last quarter", "release, evaluation, and course correction", "we again see about half the disk lit, now on the other side of the cycle."],
  [27.6841, "waning crescent", "rest, closure, and recovery", "only a slim late-cycle crescent remains before the moon returns to the sunward direction."],
  [29.5306, "new moon", "beginnings, quiet, and intention-setting", "the moon sits roughly sunward from earth, so the bright side faces mostly away from us."],
] as const;

const fullMoonNames = [
  ["2026-01-03", "wolf moon", "a midwinter full-moon name carried through almanac and folk traditions; useful here as a seasonal memory cue."],
  ["2026-02-01", "snow moon", "a late-winter name that points to weather, scarcity, and the way sky calendars preserve lived conditions."],
  ["2026-03-03", "worm moon", "an early spring name often tied to thawing ground and the return of visible life."],
  ["2026-04-01", "pink moon", "named for spring bloom traditions rather than the moon turning pink."],
  ["2026-05-01", "flower moon", "a seasonal name for a month of visible growth and abundance."],
  ["2026-05-31", "blue moon", "the second full moon in a calendar month; a calendar pattern, not a change in lunar color."],
  ["2026-06-29", "strawberry moon", "the june full moon is often called the strawberry moon in north american almanac traditions, linking sky timing with harvest memory."],
  ["2026-07-29", "buck moon", "a summer full-moon name associated with seasonal change in deer antlers in some almanac traditions."],
  ["2026-08-28", "sturgeon moon", "a late-summer seasonal name that carries fishing and food-calendar history."],
  ["2026-09-26", "corn moon", "a late-summer and early-autumn name tied to food calendars, ripening fields, and seasonal record-keeping."],
  ["2026-10-25", "hunter’s moon", "an autumn full-moon name from seasonal food and preparation calendars."],
  ["2026-11-24", "beaver moon", "a late-autumn full-moon name associated with preparation, shelter, and winter approach."],
  ["2026-12-23", "cold moon", "a winter full-moon name that records long nights and seasonal cold."],
] as const;

const dayMs = 86_400_000;

function nearestSeasonalMoon(date: Date) {
  const current = date.getTime();
  const candidates = fullMoonNames.map(([iso, seasonalName, seasonalNote]) => {
    const time = new Date(`${iso}T12:00:00Z`).getTime();
    return { seasonalName, seasonalNote, seasonalDistanceDays: Math.round((time - current) / dayMs), distance: Math.abs(time - current) };
  }).sort((a, b) => a.distance - b.distance);
  const nearest = candidates[0];
  return nearest && nearest.distance <= 3 * dayMs ? nearest : undefined;
}

export function getMoonData(date = new Date()): MoonData {
  // a known new moon anchors a simple synodic-month approximation.
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - knownNewMoon) / dayMs;
  const age = ((days % 29.53058867) + 29.53058867) % 29.53058867;
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / 29.53058867)) / 2) * 100);
  const [, name, theme, phasePhysics] = phases.find(([limit]) => age < limit) ?? phases[0];
  const direction = age < 14.765 ? "waxing" : "waning";
  const seasonal = nearestSeasonalMoon(date);
  return {
    name,
    illumination,
    direction,
    age,
    prompt: `where might ${theme} belong in your life today?`,
    phasePhysics,
    geometry: "moon phases come from changing sun-earth-moon geometry. the moon does not make its own light; we see sunlight reflected from its surface.",
    waxingWaning: direction === "waxing" ? "waxing means the visible illuminated portion is increasing from night to night." : "waning means the visible illuminated portion is decreasing from night to night.",
    tides: "lunar gravity and solar gravity both contribute to ocean tides. the strongest spring tides happen near new and full moons, while coast shape, sea floor, wind, and weather shape local results.",
    eclipses: "eclipses require a new or full moon near the places where the moon’s tilted orbit crosses earth’s orbital plane. that tilt is why eclipses do not happen every month.",
    moonlight: "moonlight is reflected sunlight and far dimmer than daylight. it can change nighttime visibility; research on consistent sleep effects is mixed, and artificial light often matters more.",
    meaning: "lunar language can name visible light cycles, tides, cultural history, agricultural calendars, sleep and darkness cues, ritual timing, and personal reflection. it does not prove control over emotion, fate, personality, or outcomes.",
    ...seasonal,
  };
}
