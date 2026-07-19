'use client';
/**
 * Station 2 — the set-piece. A raw glowing cube rides the conveyor through
 * three gates, synced 1:1 to the pinned DOM scrub (scrollBus.process):
 *   gate 1 DISCOVERY — X-ray scan (wireframe pass + laser)
 *   gate 2 BUILD     — machined into a clean geared mechanism (crossfade)
 *   gate 3 SELL      — stamped FOREMAN · DOCUMENTED, handed to the human
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';
import { makeLabelTexture } from '@/lib/labelTexture';
import { scrollBus, stationFloat } from '@/lib/scrollBus';
import { ForemanStub } from '../stubs';

const Z = -28;
const SLATS = 24;
const BELT_LEN = 14;
const GATES = [-4, 0, 4]; // world x of the three gates
const smooth = (a: number, b: number, x: number) =>
  THREE.MathUtils.smoothstep(x, a, b);

export default function ProcessStation() {
  const slats = useRef<THREE.InstancedMesh>(null);
  const product = useRef<THREE.Group>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const solid = useRef<THREE.Group>(null);
  const laser = useRef<THREE.Mesh>(null);
  const stamp = useRef<THREE.Mesh>(null);
  const gateBars = useRef<(THREE.Mesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stampTex = useMemo(
    () => makeLabelTexture('FOREMAN', { sub: 'DOCUMENTED', color: COLOR.accentBright }),
    [],
  );

  useFrame(() => {
    const d = Math.abs(stationFloat() - 2);
    if (d > 1.6) return;
    const p = scrollBus.process; // 0..1 from the pinned DOM timeline

    // belt slats advance with the scrub — the belt is scroll-tactile
    if (slats.current) {
      for (let i = 0; i < SLATS; i++) {
        const x = ((i * (BELT_LEN / SLATS) + p * 6 + BELT_LEN) % BELT_LEN) - BELT_LEN / 2;
        dummy.position.set(x, 0.62, 0);
        dummy.updateMatrix();
        slats.current.setMatrixAt(i, dummy.matrix);
      }
      slats.current.instanceMatrix.needsUpdate = true;
    }

    // product cube travels the belt
    if (product.current) {
      product.current.position.x = THREE.MathUtils.lerp(-6, 6, p);
      product.current.rotation.y = p * Math.PI * 0.5;
    }

    // DISCOVERY: laser scan near gate 1 (t≈0.17)
    if (laser.current) {
      const near = Math.exp(-Math.abs(p - 0.17) * 40);
      (laser.current.material as THREE.MeshBasicMaterial).opacity = near * 0.85;
    }

    // BUILD: wireframe → machined solid across gate 2 (t≈0.5)
    const f = smooth(0.42, 0.58, p);
    if (wireMat.current) wireMat.current.opacity = 1 - f;
    if (solid.current) {
      solid.current.visible = f > 0.01;
      solid.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && 'opacity' in m) m.opacity = f;
      });
    }

    // SELL: stamp pops on after gate 3 (t≈0.88)
    if (stamp.current) {
      const s = smooth(0.86, 0.92, p);
      stamp.current.scale.setScalar(Math.max(0.001, s));
      (stamp.current.material as THREE.MeshBasicMaterial).opacity = s;
    }

    // gate bars light as the product passes
    gateBars.current.forEach((bar, i) => {
      if (!bar) return;
      const ti = (GATES[i] + 6) / 12;
      const lit = p > ti - 0.02;
      (bar.material as THREE.MeshBasicMaterial).color.set(
        lit ? COLOR.accentBright : COLOR.line2,
      );
    });
  });

  return (
    <group position={[0, 0, Z]}>
      {/* belt frame + legs */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[BELT_LEN, 0.12, 1.4]} />
        <meshStandardMaterial color={'#202024'} roughness={0.55} metalness={0.6} />
      </mesh>
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.18, 0.45, 1.2]} />
          <meshStandardMaterial color={'#1a1a1d'} roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      {/* instanced slats */}
      <instancedMesh ref={slats} args={[undefined, undefined, SLATS]}>
        <boxGeometry args={[0.42, 0.05, 1.3]} />
        <meshStandardMaterial color={'#2c2c31'} roughness={0.6} metalness={0.5} />
      </instancedMesh>

      {/* three gates */}
      {GATES.map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.1, 0.85]}>
            <boxGeometry args={[0.14, 2.2, 0.14]} />
            <meshStandardMaterial color={'#232327'} roughness={0.5} metalness={0.65} />
          </mesh>
          <mesh position={[0, 1.1, -0.85]}>
            <boxGeometry args={[0.14, 2.2, 0.14]} />
            <meshStandardMaterial color={'#232327'} roughness={0.5} metalness={0.65} />
          </mesh>
          <mesh
            position={[0, 2.2, 0]}
            ref={(m) => {
              gateBars.current[i] = m;
            }}
          >
            <boxGeometry args={[0.14, 0.14, 1.85]} />
            <meshBasicMaterial color={COLOR.line2} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* DISCOVERY laser at gate 1 */}
      <mesh
        ref={laser}
        position={[GATES[0], 1.15, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[1.7, 1.1]} />
        <meshBasicMaterial
          color={COLOR.accentBright}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* the product: raw wireframe cube → machined mechanism */}
      <group ref={product} position={[-6, 0.98, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshBasicMaterial
            ref={wireMat}
            color={COLOR.accentMid}
            wireframe
            transparent
            toneMapped={false}
          />
        </mesh>
        <group ref={solid} visible={false}>
          <mesh>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshStandardMaterial
              color={'#2e2e34'}
              roughness={0.35}
              metalness={0.8}
              transparent
            />
          </mesh>
          <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.05, 8, 18]} />
            <meshStandardMaterial
              color={COLOR.zinc}
              roughness={0.3}
              metalness={0.9}
              transparent
            />
          </mesh>
        </group>
        {/* SELL stamp decal */}
        <mesh ref={stamp} position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.25]} />
          <meshBasicMaterial map={stampTex} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>

      {/* the human receives the finished system (PLACEHOLDER figure) */}
      <ForemanStub position={[6.9, 0, 0.6]} rotationY={-Math.PI / 2.4} />
    </group>
  );
}
