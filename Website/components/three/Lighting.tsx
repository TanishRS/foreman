'use client';
/**
 * Light budget (per concept): ambient + 2 real lights, zero shadow maps.
 * "Baked lighting" proper (AO/lightmaps) lands with the real GLB assets —
 * until then emissive materials carry most of the glow.
 *
 * The Contact power-down: as the contact section enters, the floor lights dim
 * and the single desk lamp comes up — machines rest, the human remains.
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollBus } from '@/lib/scrollBus';
import { COLOR } from '@/lib/tokens';

export default function Lighting() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.PointLight>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const lampTarget = useRef<THREE.Object3D>(null);

  useFrame((_, dt) => {
    const c = scrollBus.contact; // 0..1 power-down driver
    if (ambient.current)
      ambient.current.intensity = THREE.MathUtils.damp(
        ambient.current.intensity,
        0.3 * (1 - 0.75 * c),
        4,
        dt,
      );
    if (key.current)
      key.current.intensity = THREE.MathUtils.damp(
        key.current.intensity,
        60 * (1 - 0.85 * c),
        4,
        dt,
      );
    if (lamp.current) {
      lamp.current.intensity = THREE.MathUtils.damp(
        lamp.current.intensity,
        c * 260,
        4,
        dt,
      );
      if (lampTarget.current) lamp.current.target = lampTarget.current;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.3} color={COLOR.zinc} />
      {/* real light 1 — warm key over the hero/services end of the line */}
      <pointLight
        ref={key}
        position={[4, 7, -6]}
        intensity={60}
        color={'#f0e8dc'}
        distance={60}
        decay={1.8}
      />
      {/* real light 2 — the contact desk work lamp (starts off) */}
      <spotLight
        ref={lamp}
        position={[2.6, 3.2, -97.4]}
        angle={0.55}
        penumbra={0.6}
        intensity={0}
        color={'#f5e9d0'}
        distance={14}
        decay={1.6}
      />
      <object3D ref={lampTarget} position={[1.7, 0.9, -98]} />
    </>
  );
}
