'use client';
/**
 * SplitText line reveal (clip-path mask style) for display headlines.
 * GSAP 3.13+ ships SplitText free of charge (post-Webflow licensing) — no Club
 * license required, but this is worth re-verifying if GSAP terms change.
 * Reduced motion: text renders instantly, no split.
 */
import { createElement, useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EASE, DUR } from '@/lib/tokens';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Reveal({
  as = 'h2',
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'p' | 'div';
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let split: SplitText | null = null;
    let cancelled = false;
    const ctx = gsap.context(() => {});

    // split only after webfonts settle, or line boxes will be wrong
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'st-line',
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: DUR.mass,
          ease: EASE.mass,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      split?.revert();
    };
  }, []);

  return createElement(as, { ref, className }, children);
}
