'use client';
/**
 * Station 5 DOM — telemetry, not testimonials (NEW section).
 * DELIBERATELY EMPTY STATE: no counters animate and no quotes render until
 * real workflow stats / real references exist. Do not fabricate values here.
 * When real data lands: wire the .val elements to the production n8n stats
 * endpoint and add a GSAP number ticker on scroll-enter.
 */
import Reveal from './Reveal';

const SLOTS = ['ENQUIRIES ROUTED', 'FOLLOW-UPS SENT', 'HOURS HANDED BACK'];

export default function SocialProof() {
  return (
    <section id="proof" data-station="proof" data-stn="proof" className="section">
      <div className="wrap">
        <div className="eyebrow" data-reveal>
          / PROOF
        </div>
        <Reveal className="display display--h2 reveal-lines">
          No fake numbers here.
        </Reveal>
        <p className="lead" data-reveal style={{ margin: '12px 0 48px' }}>
          This panel is meant to show real stats pulled from live client
          workflows. Until there&apos;s public data to show, it stays honest
          and empty instead of making something up.
        </p>
        <div className="crt" data-reveal>
          <div
            className="mono-tiny"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span className="led" />
            <span>LIVE WORKFLOW STATS</span>
          </div>
          <div
            className="display"
            style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', marginTop: 22, maxWidth: '28ch' }}
          >
            No public numbers to share yet. Ask me directly and I&apos;ll tell
            you what&apos;s working.
          </div>
          <div className="crt__grid">
            {SLOTS.map((s) => (
              <div className="crt__stat" key={s}>
                <div className="mono-tiny">{s}</div>
                <div className="val" aria-label="not yet connected">
                  N/A
                </div>
                <div className="mono-tiny" style={{ marginTop: 8 }}>
                  COMES ONLINE WITH REAL PRODUCTION DATA
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
