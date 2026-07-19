'use client';
/**
 * Station 6 — the wide shot. The camera cranes up over the whole line
 * (see CameraRig) and one human figure walks its length, checking stations:
 * "one person runs all of this," rendered literally.
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stationFloat } from '@/lib/scrollBus';
import { ForemanStub } from '../stubs';

const START = -18;
const END = -66;

export default function AboutWalker() {
  const g = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const d = Math.abs(stationFloat() - 6);
    if (d > 2.2) return; // visible from farther since it's the wide shot
    if (!g.current) return;
    const span = START - END;
    const p = (clock.elapsedTime * 1.05) % (span * 2);
    // walk down the line and back
    const z = p < span ? START - p : END + (p - span);
    g.current.position.set(1.9, 0, z);
    g.current.rotation.y = p < span ? Math.PI : 0;
  });

  return (
    <group ref={g} position={[1.9, 0, START]}>
      {/* PLACEHOLDER figure — swap for rigged GLB with a walk cycle */}
      <ForemanStub walking />
    </group>
  );
}
