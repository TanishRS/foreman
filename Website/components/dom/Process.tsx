'use client';
/**
 * Station 2 DOM — the pinned set-piece (~300vh total scroll). One GSAP scrub
 * timeline drives the 01→02→03 numeral/rule highlights AND writes progress to
 * scrollBus.process, which the 3D conveyor reads 1:1 — belt, gates, laser,
 * wireframe→solid crossfade and stamp all sync to this pin.
 * Reduced motion: no pin, all three steps simply shown.
 * Copy verbatim from the original site.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollBus } from '@/lib/scrollBus';
import Reveal from './Reveal';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'DISCOVERY',
    body: "We map how your business actually runs — where time leaks, where leads die, what's worth automating and what isn't. You get a written plan with scope and price, whether or not we build together.",
  },
  {
    num: '02',
    title: 'BUILD',
    body: "Workflows and web systems built against the plan, tested on your real data, with error handling for the days things go wrong. You see progress as it happens, not at a big reveal.",
  },
  {
    num: '03',
    title: 'SELL',
    body: 'Handover that makes the system yours: documentation, credentials, a walkthrough, and a clear support option. The system keeps selling and serving while you run the business.',
  },
];

export default function Process() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrollBus.process = 1; // conveyor rests in its finished state
      return;
    }

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]', el);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            scrollBus.process = self.progress;
          },
        },
      });
      steps.forEach((step, i) => {
        const num = step.querySelector('[data-stepnum]');
        tl.to(
          num,
          { color: 'var(--accent-bright)', duration: 0.2, ease: 'none' },
          i * 0.33 + 0.06,
        ).to(
          step,
          { borderTopColor: 'var(--accent-mid)', duration: 0.2, ease: 'none' },
          i * 0.33 + 0.06,
        );
      });
    }, el);

    // The pin's 200vh spacer shifts everything below it. The station
    // enter-triggers were created before this pin, so they must be re-sorted
    // into document order FIRST — pin-distance compensation on refresh only
    // applies to triggers sorted after the pin.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="process"
      data-station="process"
      data-stn="process"
      className="section"
      ref={section}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="wrap" style={{ width: '100%' }}>
        <div className="eyebrow" data-reveal>
          / PROCESS
        </div>
        <Reveal className="display display--h2 reveal-lines">
          A real sequence, not a slogan.
        </Reveal>
        <p className="lead" data-reveal style={{ margin: '12px 0 48px' }}>
          Every engagement runs in this order. No build starts before discovery
          is done — that&apos;s the whole point.
        </p>
        <div className="process-steps">
          {STEPS.map((s) => (
            <div className="step" data-step key={s.num}>
              <div className="step__num" data-stepnum>
                {s.num}
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
