'use client';
/**
 * Station 0 — the signature shot. The 2D "FIG 01" n8n diagram reborn in 3D:
 * a floating node graph the robot arm feeds task-blocks into, with the human
 * foreman directing. Pulse sequence timing matches the original SVG (6s loop).
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';
import { makeLabelTexture } from '@/lib/labelTexture';
import { scrollBus, stationFloat } from '@/lib/scrollBus';
import { RobotArmStub, ForemanStub } from '../stubs';

// node layout mirrors FIG 01: trigger→n8n→crm / n8n→claude→email / →notify, sheet
const NODES: {
  name: string;
  sub: string;
  pos: [number, number, number];
  delay: number;
}[] = [
  { name: 'trigger', sub: 'new enquiry', pos: [-2.6, 2.15, 0], delay: 0.1 },
  { name: 'n8n', sub: 'route + enrich', pos: [0, 2.15, 0], delay: 1.85 },
  { name: 'crm', sub: 'create record', pos: [2.6, 2.15, 0], delay: 2.9 },
  { name: 'claude', sub: 'qualify lead', pos: [0, 1.25, 0.15], delay: 2.9 },
  { name: 'email', sub: 'draft reply', pos: [2.6, 1.25, 0.15], delay: 3.9 },
  { name: 'notify', sub: 'WhatsApp ping', pos: [0, 0.4, 0.3], delay: 4.85 },
  { name: 'sheet', sub: 'log row', pos: [2.6, 0.4, 0.3], delay: 4.85 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [3, 5],
  [4, 6],
];

/** intake-form submit celebration: 0..1 for ~2s after submit */
export function intakeBoost(): number {
  const dtMs = performance.now() - scrollBus.intakePulseAt;
  return dtMs < 2000 ? 1 - dtMs / 2000 : 0;
}

export default function HeroStation() {
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const blocks = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const labelTextures = useMemo(
    () => NODES.map((n) => makeLabelTexture(n.name, { sub: n.sub })),
    [],
  );

  const edgeGeo = useMemo(() => {
    const pts: number[] = [];
    for (const [a, b] of EDGES) {
      pts.push(...NODES[a].pos, ...NODES[b].pos);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    // pause when the camera is >1.5 stations away
    if (stationFloat() > 1.6) return;
    const t = clock.elapsedTime;
    const boost = intakeBoost();

    NODES.forEach((n, i) => {
      const dot = dots.current[i];
      if (!dot) return;
      const phase = (((t - n.delay) % 6) + 6) % 6;
      const glow = Math.exp(-phase * 3) + boost;
      const s = 1 + glow * 1.6;
      dot.scale.setScalar(s);
      (dot.material as THREE.MeshBasicMaterial).opacity = 0.35 + glow * 0.65;
    });

    // pallet of task-blocks; one rides toward the graph on a loop
    if (blocks.current) {
      for (let i = 0; i < 5; i++) {
        if (i < 4) {
          dummy.position.set(-4.1 + (i % 2) * 0.5, 0.2 + Math.floor(i / 2) * 0.42, 1.1);
          dummy.rotation.set(0, 0, 0);
        } else {
          const p = (t * 0.12) % 1;
          dummy.position.set(
            THREE.MathUtils.lerp(-3.9, -2.6, p),
            0.6 + Math.sin(p * Math.PI) * 1.6,
            THREE.MathUtils.lerp(1.0, 0, p),
          );
          dummy.rotation.set(p * 2, p * 3, 0);
        }
        dummy.updateMatrix();
        blocks.current.setMatrixAt(i, dummy.matrix);
      }
      blocks.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    // offset right + slightly back so the graph composes into the hero's
    // right column instead of under the headline
    <group position={[2.2, 0.15, -1.8]} scale={0.82}>
      {/* node plates */}
      {NODES.map((n, i) => (
        <group key={n.name} position={n.pos}>
          <mesh>
            <planeGeometry args={[1.7, 0.62]} />
            <meshBasicMaterial map={labelTextures[i]} toneMapped={false} />
          </mesh>
          <mesh
            position={[-0.72, 0.16, 0.02]}
            ref={(m) => {
              dots.current[i] = m;
            }}
          >
            <sphereGeometry args={[0.035, 10, 8]} />
            <meshBasicMaterial
              color={COLOR.accentBright}
              transparent
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={COLOR.line2} transparent opacity={0.8} />
      </lineSegments>

      {/* instanced task-blocks (emissive oxblood — the energy color) */}
      <instancedMesh ref={blocks} args={[undefined, undefined, 5]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={COLOR.panel}
          emissive={COLOR.accent}
          emissiveIntensity={0.9}
          roughness={0.4}
        />
      </instancedMesh>

      {/* PLACEHOLDER rigs — see components/three/stubs.tsx */}
      <RobotArmStub position={[-4.6, 0, 0.2]} scale={1.05} boost={intakeBoost} />
      <ForemanStub position={[2.2, 0, 1.7]} rotationY={-2.4} />
    </group>
  );
}
