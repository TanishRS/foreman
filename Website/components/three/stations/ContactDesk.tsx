'use client';
/**
 * Station 7 — power-down. A desk, a notepad, one work lamp (the scene's second
 * real light lives in Lighting.tsx and ramps with contact progress). Machines
 * rest; the human element remains.
 */
import { useMemo } from 'react';
import { COLOR } from '@/lib/tokens';
import { makeLabelTexture } from '@/lib/labelTexture';

const Z = -98;

export default function ContactDesk() {
  const padTex = useMemo(
    () =>
      makeLabelTexture("WHAT'S EATING", {
        sub: 'YOUR WEEK?',
        w: 256,
        h: 192,
      }),
    [],
  );

  return (
    // offset right so the DOM form/buttons don't sit on top of the desk
    <group position={[1.7, 0, Z]}>
      {/* desk */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.2]} />
        <meshStandardMaterial color={'#232327'} roughness={0.5} metalness={0.55} />
      </mesh>
      {(
        [
          [-1.1, 0.42, 0.5],
          [1.1, 0.42, 0.5],
          [-1.1, 0.42, -0.5],
          [1.1, 0.42, -0.5],
        ] as const
      ).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.85, 0.08]} />
          <meshStandardMaterial color={'#1a1a1d'} roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      {/* work lamp: base, arm, head (the actual light is in Lighting.tsx) */}
      <mesh position={[0.8, 0.93, -0.35]}>
        <cylinderGeometry args={[0.09, 0.12, 0.06, 12]} />
        <meshStandardMaterial color={'#1a1a1d'} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0.8, 1.35, -0.33]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 8]} />
        <meshStandardMaterial color={'#26262b'} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0.74, 1.78, -0.22]} rotation={[Math.PI / 3, 0, -0.4]}>
        <coneGeometry args={[0.16, 0.26, 14, 1, true]} />
        <meshStandardMaterial
          color={'#1a1a1d'}
          roughness={0.4}
          metalness={0.7}
          emissive={'#f5e9d0'}
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* notepad + pen */}
      <mesh position={[-0.25, 0.9, 0.12]} rotation={[-Math.PI / 2, 0, 0.18]}>
        <planeGeometry args={[0.42, 0.55]} />
        <meshBasicMaterial map={padTex} toneMapped={false} />
      </mesh>
      <mesh position={[0.22, 0.905, 0.25]} rotation={[0, 0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
        <meshStandardMaterial color={COLOR.accent} roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
