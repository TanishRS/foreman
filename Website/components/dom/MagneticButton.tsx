'use client';
/**
 * The site's button micro-interaction: the original wipe-fill hover (CSS)
 * plus a GSAP magnetic pull. Magnetism disables itself under reduced motion.
 */
import { useEffect, useRef, type ReactNode, type MouseEventHandler } from 'react';
import gsap from 'gsap';
import { EASE } from '@/lib/tokens';

export default function MagneticButton({
  href,
  variant = 'solid',
  children,
  onClick,
  external,
}: {
  href: string;
  variant?: 'solid' | 'ghost';
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: EASE.light });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: EASE.light });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={`btn btn--${variant}`}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
