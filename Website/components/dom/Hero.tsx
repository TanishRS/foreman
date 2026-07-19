'use client';
/**
 * Station 0 DOM — copy preserved verbatim from the original site. The right
 * column holds the static FIG 01 poster: visible until the 3D scene's first
 * frame, permanent when WebGL is unavailable.
 */
import { useAppStore } from '@/lib/store';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import NodeGraphPoster from './NodeGraphPoster';

export default function Hero() {
  const sceneReady = useAppStore((s) => s.sceneReady);
  const webgl = useAppStore((s) => s.webglSupported);
  const hidePoster = sceneReady && webgl === true;

  return (
    <section
      id="top"
      data-stn="hero"
      className="section section--texture grid-2"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'center',
        maxWidth: 1240,
        margin: '0 auto',
        padding: '156px 40px 110px',
        borderTop: 'none',
        background: 'transparent',
      }}
    >
      <div
        className="hero-scrim"
        style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
      >
        <div className="mono-label" style={{ letterSpacing: '.22em' }}>
          SOLO AI AUTOMATION STUDIO
        </div>
        <Reveal as="h1" className="display display--hero reveal-lines">
          AI automation &amp; web systems for small businesses.
        </Reveal>
        <p className="lead" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '44ch' }}>
          Foreman builds custom n8n workflows and the web systems around them,
          the unglamorous plumbing that saves you hours every week.{' '}
          <span className="ink">Discovery first, always:</span> we map the
          problem before a single node gets wired.
        </p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <MagneticButton href="#contact">BOOK A DISCOVERY CALL</MagneticButton>
          <MagneticButton href="#work" variant="ghost">
            SEE THE WORK
          </MagneticButton>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="poster" data-hidden={hidePoster}>
          <NodeGraphPoster />
        </div>
        <div
          className="mono-tiny"
          style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          <span>FIG 01 / LEAD INTAKE WORKFLOW, SIMPLIFIED</span>
        </div>
      </div>
    </section>
  );
}
