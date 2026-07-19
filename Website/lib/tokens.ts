/**
 * Design tokens — single source of truth shared by DOM (CSS vars in globals.css
 * mirror these) and the Three.js scene. Never hardcode these values elsewhere.
 */

export const COLOR = {
  bg: '#0A0A0B',
  panel: '#1C1C1F',
  line: '#2A2A2F',
  line2: '#3E3E46',
  ink: '#F5F5F3',
  muted: '#8A8A93',
  /** Oxblood family — the ONE energy color (glows, pulses, LEDs, lasers). */
  accent: '#7A1F2B',
  accentMid: '#C4293D',
  accentBright: '#EC3E54',
  /** Cold zinc — machined-metal speculars only. */
  zinc: '#B8BDC4',
  /** Reserved exclusively for LIVE / in-production indicators. */
  live: '#4C9A63',
  /** Amber — IN PROGRESS beacons. */
  amber: '#C98A2D',
} as const;

/**
 * Motion language:
 *  - heavy things ease like they have mass (power4.out, long durations)
 *  - lights/pulses are quick (expo.out, short durations)
 *  - nothing bounces, nothing floats aimlessly
 */
export const EASE = {
  mass: 'power4.out',
  light: 'expo.out',
} as const;

export const DUR = {
  mass: 0.9,
  light: 0.35,
} as const;

/** Ordered stations along the assembly line (camera dolly order). */
export const STATIONS = [
  'hero',
  'services',
  'process',
  'work',
  'stack',
  'proof',
  'about',
  'contact',
] as const;

export type StationId = (typeof STATIONS)[number];
export const STATION_COUNT = STATIONS.length;
