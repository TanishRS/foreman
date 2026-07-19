'use client';
/**
 * Etched-plate label textures drawn to offscreen canvases — keeps all 3D text
 * in the IBM Plex Mono voice without shipping troika's CDN-loaded default font.
 */
import * as THREE from 'three';
import { COLOR } from './tokens';

const cache = new Map<string, THREE.CanvasTexture>();

export function makeLabelTexture(
  text: string,
  opts: { sub?: string; color?: string; w?: number; h?: number } = {},
): THREE.CanvasTexture {
  const key = `${text}|${opts.sub ?? ''}|${opts.color ?? ''}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const w = opts.w ?? 512;
  const h = opts.h ?? 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = COLOR.panel;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = COLOR.line;
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.fillStyle = opts.color ?? COLOR.ink;
  ctx.font = `500 ${Math.round(h * 0.22)}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), w / 2, opts.sub ? h * 0.42 : h / 2, w * 0.86);

  if (opts.sub) {
    ctx.fillStyle = COLOR.muted;
    ctx.font = `400 ${Math.round(h * 0.12)}px "IBM Plex Mono", monospace`;
    ctx.fillText(opts.sub, w / 2, h * 0.68, w * 0.9);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}
