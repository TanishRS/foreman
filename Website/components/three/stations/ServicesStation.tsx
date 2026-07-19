'use client';
/**
 * Station 1 — two machines, one line.
 * A: the workflow assembler (wired mini node graph, live pulses)
 * B: the glass storefront — a website UI extruded panel-by-panel as the
 *    section scrolls in (driven by the services enter-progress).
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';
import { scrollBus, stationFloat } from '@/lib/scrollBus';

const Z = -14;

export default function ServicesStation() {
  const miniDots = useRef<(THREE.Mesh | null)[]>([]);
  const panels = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const d = Math.abs(stationFloat() - 1);
    if (d > 1.6) return;
    const t = clock.elapsedTime;

    miniDots.current.forEach((m, i) => {
      if (!m) return;
      const glow = Math.exp(-((((t - i * 0.7) % 3) + 3) % 3) * 3.5);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.25 + glow * 0.75;
    });

    // storefront panels extrude with section progress, staggered
    const p = scrollBus.stations[1] ?? 0;
    panels.current.forEach((m, i) => {
      if (!m) return;
      const local = THREE.MathUtils.clamp(p * 1.6 - i * 0.25, 0, 1);
      m.position.z = 0.05 + local * 0.38;
      (m.material as THREE.MeshStandardMaterial).opacity = 0.15 + local * 0.85;
    });
  });

  return (
    <group position={[0, 0, Z]}>
      {/* ---- Station A: workflow assembler ---- */}
      <group position={[-2.4, 0, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.7, 1.6, 1.2]} />
          <meshStandardMaterial color={'#232327'} roughness={0.5} metalness={0.65} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[-0.45 + i * 0.45, 1.05 - (i % 2) * 0.35, 0.62]}
            ref={(m) => {
              miniDots.current[i] = m;
            }}
          >
            <boxGeometry args={[0.16, 0.16, 0.05]} />
            <meshBasicMaterial color={COLOR.accentBright} transparent toneMapped={false} />
          </mesh>
        ))}
        {/* conduit into the line */}
        <mesh position={[1.15, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 8]} />
          <meshStandardMaterial color={COLOR.line2} roughness={0.6} metalness={0.5} />
        </mesh>
      </group>

      {/* ---- Station B: glass storefront ---- */}
      <group position={[2.4, 0, 0]}>
        {/* frame */}
        {(
          [
            [0, 2.05, 0, 2.4, 0.08, 0.12],
            [0, 0.45, 0, 2.4, 0.08, 0.12],
            [-1.16, 1.25, 0, 0.08, 1.7, 0.12],
            [1.16, 1.25, 0, 0.08, 1.7, 0.12],
          ] as const
        ).map(([x, y, z, w, h, dz], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[w, h, dz]} />
            <meshStandardMaterial color={'#232327'} roughness={0.5} metalness={0.65} />
          </mesh>
        ))}
        {/* glass */}
        <mesh position={[0, 1.25, 0]}>
          <planeGeometry args={[2.28, 1.58]} />
          <meshBasicMaterial
            color={COLOR.zinc}
            transparent
            opacity={0.07}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* extruding UI panels (header / content / CTA) */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, 1.75 - i * 0.5, 0.05]}
            ref={(m) => {
              panels.current[i] = m;
            }}
          >
            <boxGeometry args={[1.9 - i * 0.35, 0.3, 0.08]} />
            <meshStandardMaterial
              color={COLOR.panel}
              emissive={i === 2 ? COLOR.accent : '#151517'}
              emissiveIntensity={i === 2 ? 0.8 : 0.4}
              transparent
              opacity={0.15}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
