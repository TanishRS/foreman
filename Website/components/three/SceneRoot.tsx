'use client';
/**
 * The single persistent Canvas behind the DOM — all stations live in one scene,
 * the camera dollies along the assembly line. Scenography only: every word on
 * the page remains real, crawlable HTML in the DOM layer above.
 *
 * Performance contract:
 *  - DPR clamped to [1, 1.5]; PerformanceMonitor degrades to DPR 1 on decline
 *  - no real-time shadows anywhere; 2 real lights + ambient (see Lighting)
 *  - repeated meshes are instanced (conveyor, task blocks, plates)
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useAppStore, detectWebGL } from '@/lib/store';
import { COLOR } from '@/lib/tokens';
import CameraRig from './CameraRig';
import Lighting from './Lighting';
import FactoryFloor from './FactoryFloor';
import HeroStation from './stations/HeroStation';
import ServicesStation from './stations/ServicesStation';
import ProcessStation from './stations/ProcessStation';
import WorkBay from './stations/WorkBay';
import TechWall from './stations/TechWall';
import ProofPanel from './stations/ProofPanel';
import AboutWalker from './stations/AboutWalker';
import ContactDesk from './stations/ContactDesk';

/** Flags the scene ready after the first rendered frame (fades the poster). */
function ReadySignal() {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    // defer out of the render loop
    queueMicrotask(() => useAppStore.getState().setSceneReady(true));
  });
  return null;
}

export default function SceneRoot() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const quality = useAppStore((s) => s.quality);
  const setQuality = useAppStore((s) => s.setQuality);

  useEffect(() => {
    const ok = detectWebGL();
    setWebgl(ok);
    useAppStore.getState().setWebglSupported(ok);
  }, []);

  // No-WebGL fallback: no canvas at all — DOM poster stays visible.
  if (webgl !== true) return null;

  return (
    <div className="canvas-root" aria-hidden="true">
      <Canvas
        dpr={quality === 'high' ? [1, 1.5] : 1}
        camera={{ fov: 42, near: 0.1, far: 180, position: [0, 2.2, 8] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows={false}
        onCreated={({ scene }) => {
          scene.background = null;
        }}
      >
        <PerformanceMonitor
          onDecline={() => setQuality('low')}
          onIncline={() => setQuality('high')}
        >
          <fog attach="fog" args={[COLOR.bg, 14, 62]} />
          <ReadySignal />
          <CameraRig />
          <Lighting />
          <FactoryFloor />
          <HeroStation />
          <ServicesStation />
          <ProcessStation />
          <WorkBay />
          <TechWall />
          <ProofPanel />
          <AboutWalker />
          <ContactDesk />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
