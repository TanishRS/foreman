/**
 * Plain mutable ref-bus bridging GSAP ScrollTrigger (writers) and the R3F
 * useFrame loop (readers). Deliberately NOT React state — per-frame writes must
 * never trigger React renders. Infrequent state (quality tier, reduced motion,
 * active section) lives in the Zustand store instead.
 */
import { STATION_COUNT } from './tokens';

export const scrollBus = {
  /** Enter-progress (0..1) per station index; index 0 (hero) is always "entered". */
  stations: new Array<number>(STATION_COUNT).fill(0),
  /** Pinned conveyor scrub progress (0..1) written by the Process timeline. */
  process: 0,
  /** Contact section progress (0..1) — drives the scene-wide power-down. */
  contact: 0,
  /** Index of the hovered Work card (tilts the matching 3D unit), or -1. */
  hoveredWork: -1,
  /** Index of the hovered tech plate (highlights the matching 3D plate), or -1. */
  hoveredPlate: -1,
  /** Set to performance.now() when the intake form is submitted (fires node-graph pulse). */
  intakePulseAt: 0,
};

/**
 * Camera dolly parameter: sum of sequential enter-progresses = float station
 * index (0 = hero … STATION_COUNT-1 = contact). Monotonic under normal page
 * flow; the Process pin naturally makes the camera dwell at the conveyor.
 */
// dev/debug visibility only
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__scrollBus = scrollBus;
}

export function stationFloat(): number {
  let s = 0;
  for (let i = 1; i < STATION_COUNT; i++) s += scrollBus.stations[i] ?? 0;
  return s;
}
