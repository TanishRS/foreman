'use client';
/**
 * Station 3 DOM — the honest case cards, verbatim. Hovering a card tilts the
 * matching 3D unit in the bay (scrollBus.hoveredWork bridge).
 */
import { scrollBus } from '@/lib/scrollBus';
import Reveal from './Reveal';

const BUILDS = [
  {
    live: true,
    status: 'LIVE',
    title: 'Lead intake & follow-up',
    body: 'Enquiries from web forms and WhatsApp routed through n8n: qualified by Claude, logged to CRM, first reply drafted within minutes. Running for a local trades business.',
    stack: 'n8n · claude · crm · whatsapp',
  },
  {
    live: false,
    status: 'IN PROGRESS',
    title: 'Quote & invoice chaser',
    body: 'Automatic, polite follow-ups on unanswered quotes and overdue invoices, with a daily digest of who to call personally. In build for a service business.',
    stack: 'n8n · accounting api · email',
  },
  {
    live: false,
    status: 'IN PROGRESS',
    title: 'Site + booking system',
    body: 'A fast one-page site with an intake form that feeds bookings straight into calendar and CRM — no copy-pasting between tabs. This site is built on the same stack.',
    stack: 'web · forms · calendar · crm',
  },
];

export default function Work() {
  return (
    <section id="work" data-station="work" data-stn="work" className="section">
      <div className="wrap">
        <div className="eyebrow" data-reveal>
          / WORK
        </div>
        <Reveal className="display display--h2 reveal-lines">
          Current builds, shown honestly.
        </Reveal>
        <p className="lead" data-reveal style={{ margin: '12px 0 48px' }}>
          No fake logos, no invented stats. This is what&apos;s live and
          what&apos;s on the bench right now.
        </p>
        <div
          className="grid-3"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}
        >
          {BUILDS.map((b, i) => (
            <div
              key={b.title}
              className="card"
              data-reveal
              style={{ padding: 32, gap: 16 }}
              onMouseEnter={() => {
                scrollBus.hoveredWork = i;
              }}
              onMouseLeave={() => {
                scrollBus.hoveredWork = -1;
              }}
            >
              <div
                className="mono-tiny"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span className={`dot ${b.live ? 'dot--live' : 'dot--progress'}`} />
                <span style={{ color: b.live ? 'var(--live)' : 'var(--muted)' }}>
                  {b.status}
                </span>
              </div>
              <h3 className="display" style={{ fontSize: 28 }}>
                {b.title}
              </h3>
              <p className="lead" style={{ fontSize: 14 }}>
                {b.body}
              </p>
              <div className="mono-tiny" style={{ marginTop: 'auto', paddingTop: 8 }}>
                {b.stack}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
