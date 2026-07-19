'use client';
/**
 * ============================================================================
 * PLACEHOLDER ASSETS — both figures below are primitive stand-ins.
 * Replace with Draco/Meshopt-compressed GLBs (rigged robot arm ~6 bones with
 * "pick" clips; stylized low-poly foreman figure with walk/point poses).
 * Combined budget for the real assets: ≤2.5 MB. Keep the same group pivots so
 * the swap is drop-in.
 * ============================================================================
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';

const steel = { color: '#26262b', roughness: 0.55, metalness: 0.7 } as const;

/**
 * PLACEHOLDER: robot arm — base + shoulder + elbow segments doing a slow,
 * deliberate "pick" loop. Only ever *executes*; oxblood ring light per joint.
 */
export function RobotArmStub(props: {
  position?: [number, number, number];
  scale?: number;
  /** extra energy 0..1 (e.g. intake-pulse celebration) */
  boost?: () => number;
}) {
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const wrist = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const b = props.boost?.() ?? 0;
    const speed = 0.45 + b * 1.2;
    // mass-heavy pick cycle: reach forward+down, lift, swing back
    const cyc = Math.sin(t * speed);
    const cyc2 = Math.sin(t * speed + Math.PI / 3);
    if (shoulder.current) {
      shoulder.current.rotation.y = cyc * 0.7;
      shoulder.current.rotation.z = 0.25 + cyc2 * 0.18;
    }
    if (elbow.current) elbow.current.rotation.z = -0.9 - cyc2 * 0.35;
    if (wrist.current) wrist.current.rotation.z = 0.5 + cyc * 0.25;
  });

  return (
    <group position={props.position} scale={props.scale ?? 1}>
      {/* base */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.5, 20]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <group ref={shoulder} position={[0, 0.55, 0]}>
        <JointRing />
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.34, 1.6, 0.34]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <group ref={elbow} position={[0, 1.6, 0]}>
          <JointRing />
          <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.26, 1.3, 0.26]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <group ref={wrist} position={[1.3, 0, 0]}>
            <JointRing small />
            {/* gripper */}
            <mesh position={[0.28, -0.08, 0.09]}>
              <boxGeometry args={[0.4, 0.1, 0.08]} />
              <meshStandardMaterial {...steel} />
            </mesh>
            <mesh position={[0.28, -0.08, -0.09]}>
              <boxGeometry args={[0.4, 0.1, 0.08]} />
              <meshStandardMaterial {...steel} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function JointRing({ small }: { small?: boolean }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[small ? 0.16 : 0.26, 0.035, 10, 28]} />
      <meshBasicMaterial color={COLOR.accentBright} toneMapped={false} />
    </mesh>
  );
}

/**
 * PLACEHOLDER: the human foreman — capsule + head + clipboard, always in a
 * directing/inspecting posture, never idle, never replaced by the robot.
 */
export function ForemanStub(props: {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  /** walk-cycle phase driver; omit for a standing "pointing" pose */
  walking?: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (root.current && props.walking) {
      root.current.position.y = Math.abs(Math.sin(t * 3.2)) * 0.05;
    }
    if (armR.current && !props.walking) {
      // pointing gesture, slow authoritative sweep
      armR.current.rotation.z = -1.15 + Math.sin(t * 0.6) * 0.08;
    }
  });

  return (
    <group
      position={props.position}
      rotation={[0, props.rotationY ?? 0, 0]}
      scale={props.scale ?? 1}
    >
      <group ref={root}>
        {/* body */}
        <mesh position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.22, 0.75, 6, 14]} />
          <meshStandardMaterial color={'#3a3a40'} roughness={0.8} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.16, 16, 14]} />
          <meshStandardMaterial color={'#4a4a52'} roughness={0.8} />
        </mesh>
        {/* hard hat — the one oxblood detail */}
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.17, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={COLOR.accent}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* pointing arm + clipboard */}
        <group ref={armR} position={[0.24, 1.28, 0]}>
          <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.06, 0.42, 4, 10]} />
            <meshStandardMaterial color={'#3a3a40'} roughness={0.8} />
          </mesh>
        </group>
        <mesh position={[-0.3, 1.1, 0.1]} rotation={[0.2, 0.3, 0]}>
          <boxGeometry args={[0.24, 0.34, 0.02]} />
          <meshStandardMaterial color={COLOR.zinc} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
