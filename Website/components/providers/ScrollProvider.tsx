'use client';
/**
 * Owns: Lenis smooth scroll bridged into GSAP ScrollTrigger, reduced-motion
 * detection, the per-station enter triggers that feed the camera dolly, and
 * the active-station observer for the nav readout.
 */
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scrollBus } from '@/lib/scrollBus';
import { STATIONS, EASE, DUR, type StationId } from '@/lib/tokens';
import { useAppStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

// dev/debug visibility only
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
}

export default function ScrollProvider() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useAppStore.getState().setReducedMotion(reduced);

    let lenis: Lenis | null = null;
    let rafCb: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.11 });
      lenis.on('scroll', ScrollTrigger.update);
      rafCb = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(rafCb);
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor links route through Lenis so smooth scroll isn't bypassed.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView();
    };
    document.addEventListener('click', onClick);

    // Station enter triggers → scrollBus (camera dolly parameter).
    // Station 0 (hero) is the resting position and needs no trigger.
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-station]'),
    );
    const triggers = els.map((el) => {
      const idx = STATIONS.indexOf(el.dataset.station as StationId);
      return ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (self) => {
          scrollBus.stations[idx] = self.progress;
          if (el.dataset.station === 'contact') scrollBus.contact = self.progress;
        },
      });
    });

    // Soft entrances for cards/copy blocks (mass easing — nothing bounces).
    const revealCtx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: DUR.mass,
          ease: EASE.mass,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    });

    // Active station for the nav split-flap readout.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.stn as StationId;
          if (id) useAppStore.getState().setActiveStation(id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    document
      .querySelectorAll<HTMLElement>('[data-stn]')
      .forEach((el) => io.observe(el));

    return () => {
      revealCtx.revert();
      triggers.forEach((t) => t.kill());
      io.disconnect();
      document.removeEventListener('click', onClick);
      if (rafCb) gsap.ticker.remove(rafCb);
      lenis?.destroy();
    };
  }, []);

  return null;
}
