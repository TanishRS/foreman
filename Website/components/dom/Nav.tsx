'use client';
/**
 * Slim mono rail + machine-readout station indicator (`STN 02 / SERVICES`)
 * with a split-flap digit roll on station change.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store';
import { STATIONS, EASE, DUR } from '@/lib/tokens';

const LINKS: { id: string; label: string }[] = [
  { id: 'services', label: 'SERVICES' },
  { id: 'process', label: 'PROCESS' },
  { id: 'work', label: 'WORK' },
  { id: 'stack', label: 'STACK' },
  { id: 'proof', label: 'PROOF' },
  { id: 'about', label: 'ABOUT' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Nav() {
  const active = useAppStore((s) => s.activeStation);
  const readout = useRef<HTMLSpanElement>(null);
  const idx = STATIONS.indexOf(active);

  useEffect(() => {
    if (!readout.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      readout.current,
      { yPercent: 100 },
      { yPercent: 0, duration: DUR.light, ease: EASE.light },
    );
  }, [active]);

  return (
    <nav className="nav" aria-label="Main">
      <a className="nav__brand" href="#top">
        <span className="sq" />
        <span>FOREMAN</span>
      </a>
      <div className="nav__links">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} data-active={active === l.id}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav__stn" aria-live="polite">
        <span>STN</span>
        <span className="digits">
          <span ref={readout}>
            {String(idx + 1).padStart(2, '0')} / {active.toUpperCase()}
          </span>
        </span>
      </div>
    </nav>
  );
}
