'use client';
/**
 * Client wrapper so the WebGL scene code-splits and streams in AFTER first
 * paint — the DOM (with the static FIG 01 poster) renders immediately.
 */
import dynamic from 'next/dynamic';

const SceneRoot = dynamic(() => import('./SceneRoot'), { ssr: false });

export default function SceneMount() {
  return <SceneRoot />;
}
