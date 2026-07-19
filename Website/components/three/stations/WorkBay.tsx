'use client';
/**
 * Station 3 — finished-units bay. One unit per real build, status beacons
 * (green = LIVE only, amber = IN PROGRESS). Hovering the DOM card tilts the
 * matching unit toward the viewer (bridged via scrollBus.hoveredWork).
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';
import { makeLabelTexture } from '@/lib/labelTexture';
import { scrollBus, stationFloat } from '@/lib/scrollBus';

const Z = -42;
const UNITS = [
  { label: 'LEAD INTAKE', live: true, x: -3 },
  { label: 'QUOTE CHASER', live: false, x: 0 },
  { label: 'SITE + BOOKING', live: false, x: 3 },
];

export default function WorkBay() {
  const crates = useRef<(THREE.Group | null)[]>([]);
  const beacons = useRef<(THREE.Mesh | null)[]>([]);
  const labels = useMemo(
    () => UNITS.map((u) => makeLabelTexture(u.label, { w: 512, h: 160 })),
    [],
  );

  useFrame(({ clock }, dt) => {
    const d = Math.abs(stationFloat() - 3);
    if (d > 1.6) return;
    const t = clock.elapsedTime;

    UNITS.forEach((u, i) => {
      const beacon = beacons.current[i];
      if (beacon) {
        const m = beacon.material as THREE.MeshBasicMaterial;
        const pulse = u.live
          ? 0.55 + 0.45 * Math.sin(t * 2.4)
          : 0.35 + 0.3 * Math.sin(t * 1.1 + i);
        m.opacity = pulse;
      }
      const crate = crates.current[i];
      if (crate) {
        const hovered = scrollBus.hoveredWork === i;
        crate.rotation.x = THREE.MathUtils.damp(
          crate.rotation.x,
          hovered ? -0.14 : 0,
          8,
          dt,
        );
        crate.rotation.y = THREE.MathUtils.damp(
          crate.rotation.y,
          hovered ? (i - 1) * -0.12 + 0.1 : 0,
          8,
          dt,
        );
      }
    });
  });

  return (
    <group position={[0, 0, Z]}>
      {UNITS.map((u, i) => (
        <group
          key={u.label}
          position={[u.x, 0, 0]}
          ref={(g) => {
            crates.current[i] = g;
          }}
        >
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.5, 1.4, 1.5]} />
            <meshStandardMaterial
              color={COLOR.panel}
              roughness={0.6}
              metalness={0.45}
            />
          </mesh>
          {/* etched unit label */}
          <mesh position={[0, 0.78, 0.76]}>
            <planeGeometry args={[1.25, 0.4]} />
            <meshBasicMaterial map={labels[i]} toneMapped={false} />
          </mesh>
          {/* status beacon — green is reserved for LIVE */}
          <mesh position={[0, 1.62, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 6]} />
            <meshStandardMaterial color={COLOR.line2} roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh
            position={[0, 1.9, 0]}
            ref={(m) => {
              beacons.current[i] = m;
            }}
          >
            <sphereGeometry args={[0.09, 12, 10]} />
            <meshBasicMaterial
              color={u.live ? COLOR.live : COLOR.amber}
              transparent
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
