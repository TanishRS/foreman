'use client';
/**
 * Station 5 — control-room telemetry panel. CRT scanline shader + blinking
 * LED. Honest by design: it renders the AWAITING state until real workflow
 * stats are wired in. On the low quality tier the shader time freezes.
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLOR } from '@/lib/tokens';
import { makeLabelTexture } from '@/lib/labelTexture';
import { stationFloat } from '@/lib/scrollBus';
import { useAppStore } from '@/lib/store';

const Z = -70;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec3 base = vec3(0.075, 0.075, 0.082);           // panel
    vec3 glow = vec3(0.478, 0.122, 0.169) * 0.35;    // oxblood energy
    float scan = sin(vUv.y * 240.0 - uTime * 3.0) * 0.5 + 0.5;
    float flicker = 0.965 + 0.035 * sin(uTime * 13.7);
    float vig = smoothstep(1.05, 0.35, distance(vUv, vec2(0.5)));
    vec3 c = (base + glow * scan * 0.25) * flicker * vig;
    gl_FragColor = vec4(c, 1.0);
  }
`;

export default function ProofPanel() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const led = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const awaitTex = useMemo(
    () =>
      makeLabelTexture('AWAITING FIRST PUBLIC REFERENCE', {
        sub: 'ASK ME FOR ONE PRIVATELY',
        color: COLOR.muted,
        w: 1024,
        h: 256,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const d = Math.abs(stationFloat() - 5);
    if (d > 1.6) return;
    const t = clock.elapsedTime;
    // low tier: freeze shader time (static panel, still lit)
    if (mat.current && useAppStore.getState().quality === 'high')
      uniforms.uTime.value = t;
    if (led.current) {
      const on = t % 2.4 < 2.2;
      (led.current.material as THREE.MeshBasicMaterial).opacity = on ? 1 : 0.15;
    }
  });

  return (
    <group position={[0, 0, Z]}>
      {/* frame */}
      <mesh position={[0, 1.6, -0.05]}>
        <boxGeometry args={[6.4, 3.2, 0.14]} />
        <meshStandardMaterial color={'#1a1a1d'} roughness={0.5} metalness={0.6} />
      </mesh>
      {/* CRT surface */}
      <mesh position={[0, 1.6, 0.03]}>
        <planeGeometry args={[6.0, 2.85]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vert}
          fragmentShader={frag}
        />
      </mesh>
      {/* the honest state, etched faintly on the glass */}
      <mesh position={[0, 1.7, 0.05]}>
        <planeGeometry args={[4.6, 1.15]} />
        <meshBasicMaterial map={awaitTex} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      {/* blinking LED */}
      <mesh position={[2.85, 2.95, 0.06]} ref={led}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshBasicMaterial color={COLOR.accentBright} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
