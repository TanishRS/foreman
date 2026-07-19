'use client';
/**
 * Dark concrete floor + hairline grid running the length of the line.
 * Single plane + gridHelper — no textures, no shadows.
 */
import { COLOR } from '@/lib/tokens';

export default function FactoryFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -46]}>
        <planeGeometry args={[240, 260]} />
        <meshStandardMaterial color={'#0c0c0e'} roughness={1} metalness={0} />
      </mesh>
      <gridHelper
        args={[240, 120, COLOR.line, COLOR.panel]}
        position={[0, 0, -46]}
      />
      {/* oxblood guide strip down the center of the line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -46]}>
        <planeGeometry args={[0.12, 240]} />
        <meshBasicMaterial color={COLOR.accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
