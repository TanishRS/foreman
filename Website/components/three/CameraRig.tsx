'use client';
/**
 * Scroll-driven camera dolly along the assembly line.
 * Two CatmullRom curves (positions + look targets); the dolly parameter comes
 * from the scrollBus station float written by ScrollTrigger. Reduced motion:
 * the camera snaps between stations (fast damp to the rounded station) instead
 * of continuously dollying.
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stationFloat } from '@/lib/scrollBus';
import { STATION_COUNT } from '@/lib/tokens';
import { useAppStore } from '@/lib/store';

// One keyframe per station: hero, services, process, work, stack, proof,
// about (crane-up wide shot looking back over the line), contact (desk).
const POS: [number, number, number][] = [
  [-2.2, 2.1, 8.8],
  [-3.2, 2.0, -7],
  [0, 2.7, -20.4],
  [-3.2, 2.0, -35],
  [3.2, 2.0, -49],
  [0, 1.8, -63],
  [0, 10.0, -64],
  [0, 1.7, -91],
];
const LOOK: [number, number, number][] = [
  [1.2, 1.5, -1.5],
  [0, 1.2, -14],
  [0, 0.8, -28],
  [0, 1.2, -42],
  [0, 1.6, -56],
  [0, 1.4, -70],
  [0, 1.0, -38],
  [0, 1.0, -98],
];

export default function CameraRig() {
  const reduced = useAppStore((s) => s.reducedMotion);
  const t = useRef(0);
  const v = useMemo(
    () => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }),
    [],
  );

  const { posCurve, lookCurve } = useMemo(() => {
    const mk = (pts: [number, number, number][]) =>
      new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p)),
        false,
        'centripetal',
      );
    return { posCurve: mk(POS), lookCurve: mk(LOOK) };
  }, []);

  useFrame(({ camera }, dt) => {
    const raw = stationFloat();
    const target = THREE.MathUtils.clamp(
      (reduced ? Math.round(raw) : raw) / (STATION_COUNT - 1),
      0,
      1,
    );
    // heavy-mass easing: the camera is a machine on rails, not a drone
    t.current = THREE.MathUtils.damp(t.current, target, reduced ? 14 : 2.4, dt);
    // getPoint (NOT getPointAt): uniform per-segment parameter, so station i
    // lands exactly at u = i/(N-1) regardless of physical spacing
    posCurve.getPoint(t.current, v.pos);
    lookCurve.getPoint(t.current, v.look);
    camera.position.copy(v.pos);
    camera.lookAt(v.look);
  });

  return null;
}
