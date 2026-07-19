'use client';
/**
 * Zustand store for INFREQUENT app state only (renders are fine here).
 * Per-frame scroll values live in lib/scrollBus.ts.
 */
import { create } from 'zustand';
import type { StationId } from './tokens';

export type Quality = 'high' | 'low';

interface AppState {
  /** null = not yet detected (SSR-safe). */
  webglSupported: boolean | null;
  reducedMotion: boolean;
  /** Adaptive tier set by drei's PerformanceMonitor. */
  quality: Quality;
  /** First frame rendered — fades the static poster out. */
  sceneReady: boolean;
  activeStation: StationId;
  setWebglSupported: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setQuality: (v: Quality) => void;
  setSceneReady: (v: boolean) => void;
  setActiveStation: (v: StationId) => void;
}

export const useAppStore = create<AppState>((set) => ({
  webglSupported: null,
  reducedMotion: false,
  quality: 'high',
  sceneReady: false,
  activeStation: 'hero',
  setWebglSupported: (webglSupported) => set({ webglSupported }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setQuality: (quality) => set({ quality }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setActiveStation: (activeStation) => set({ activeStation }),
}));

export function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
