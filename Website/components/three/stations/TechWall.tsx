'use client';
/**
 * Station 4 — the parts wall. Real tools as machined plates (instanced bodies
 * + individually textured etched labels). Deliberately egalitarian: same size,
 * same finish — no brand dominates, no endorsement implied.
 *
 * FLAG: the concept's "arm plucks a plate and installs it" is simplified to a
 * cyclic pluck highlight until the real rigged-arm GLB exists. Real brand SVG
 * logos are also pending a licensing pass — etched text names ship first.
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { makeLabelTexture } from '@/lib/labelTexture';
import { scrollBus, stationFloat } from '@/lib/scrollBus';

const Z = -56;
export const TOOLS = [
  'n8n',
  'Claude',
  'Node.js',
  'TypeScript',
  'Python',
  'React',
  'Next.js',
  'Vercel',
  'PostgreSQL',
  'WhatsApp',
  'G Workspace',
  'Stripe',
];
const COLS = 4;

function slot(i: number): [number, number] {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return [(col - (COLS - 1) / 2) * 1.85, 3.2 - row * 1.0];
}

export default function TechWall() {
  const bodies = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const zOff = useRef(new Float32Array(TOOLS.length));
  const labelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const textures = useMemo(
    () => TOOLS.map((t) => makeLabelTexture(t, { w: 512, h: 224 })),
    [],
  );

  useFrame(({ clock }, dt) => {
    const d = Math.abs(stationFloat() - 4);
    if (d > 1.6) return;
    const t = clock.elapsedTime;
    const plucked = Math.floor(t / 2.5) % TOOLS.length;

    if (bodies.current) {
      for (let i = 0; i < TOOLS.length; i++) {
        const [x, y] = slot(i);
        const target =
          scrollBus.hoveredPlate === i ? 0.35 : plucked === i ? 0.22 : 0;
        zOff.current[i] = THREE.MathUtils.damp(zOff.current[i], target, 6, dt);
        dummy.position.set(x, y, zOff.current[i]);
        dummy.rotation.set(0, Math.sin(t * 0.25 + i) * 0.02, 0);
        dummy.updateMatrix();
        bodies.current.setMatrixAt(i, dummy.matrix);
        const label = labelRefs.current[i];
        if (label) label.position.set(x, y, zOff.current[i] + 0.045);
      }
      bodies.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, Z]}>
      {/* backing wall */}
      <mesh position={[0, 2.2, -0.4]}>
        <planeGeometry args={[9.5, 4.6]} />
        <meshStandardMaterial color={'#131316'} roughness={0.9} metalness={0.1} />
      </mesh>
      <instancedMesh ref={bodies} args={[undefined, undefined, TOOLS.length]}>
        <boxGeometry args={[1.6, 0.82, 0.07]} />
        <meshStandardMaterial color={'#232327'} roughness={0.35} metalness={0.8} />
      </instancedMesh>
      {TOOLS.map((name, i) => (
        <mesh
          key={name}
          ref={(m) => {
            labelRefs.current[i] = m;
          }}
          position={[slot(i)[0], slot(i)[1], 0.045]}
        >
          <planeGeometry args={[1.5, 0.72]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
