'use client';
/**
 * Station 4 DOM — the parts wall (NEW section). Real tools only; hover/focus
 * flips a plate to show what Foreman actually uses it for. Hover also
 * highlights the matching 3D plate (scrollBus.hoveredPlate bridge).
 *
 * LICENSING FLAG: names are trademarks of their owners; shown here as etched
 * text in a nominal "built with" sense. Real logo SVGs need a per-brand
 * guideline check (Anthropic, Vercel, n8n etc. publish usage pages) before
 * shipping — no implied endorsement, no altered marks.
 */
import { scrollBus } from '@/lib/scrollBus';
import Reveal from './Reveal';

const TOOLS: { name: string; use: string }[] = [
  { name: 'n8n', use: 'workflow engine you own' },
  { name: 'Claude', use: 'lead qualification, drafting' },
  { name: 'Node.js', use: 'glue services & APIs' },
  { name: 'TypeScript', use: 'safer internal tools' },
  { name: 'Python', use: 'data munging, reports' },
  { name: 'React', use: 'interactive front-ends' },
  { name: 'Next.js', use: 'sites like this one' },
  { name: 'Vercel', use: 'hosting & previews' },
  { name: 'PostgreSQL', use: 'system of record' },
  { name: 'WhatsApp Business', use: 'notifications & intake' },
  { name: 'Google Workspace', use: 'sheets, mail, calendar wiring' },
  { name: 'Stripe', use: 'payments & invoicing hooks' },
];

export default function TechStack() {
  return (
    <section id="stack" data-station="stack" data-stn="stack" className="section">
      <div className="wrap">
        <div className="eyebrow" data-reveal>
          / STACK
        </div>
        <Reveal className="display display--h2 reveal-lines">
          Built with parts you can inspect.
        </Reveal>
        <p className="lead" data-reveal style={{ margin: '12px 0 48px' }}>
          These are the tools every build draws from, things you can own,
          read, and swap out if you want to. Flip a plate to see what each one
          actually does here.
        </p>
        <ul className="plates" style={{ listStyle: 'none' }} data-reveal>
          {TOOLS.map((t, i) => (
            <li
              key={t.name}
              className="plate"
              tabIndex={0}
              onMouseEnter={() => {
                scrollBus.hoveredPlate = i;
              }}
              onMouseLeave={() => {
                scrollBus.hoveredPlate = -1;
              }}
            >
              <div className="plate__inner">
                <div className="plate__face plate__face--front">{t.name}</div>
                <div className="plate__face plate__face--back">
                  {t.name}: {t.use}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mono-tiny" data-reveal style={{ marginTop: 24 }}>
          ALL TRADEMARKS BELONG TO THEIR OWNERS. LISTED HERE AS TOOLS USED,
          NOT ENDORSEMENTS.
        </p>
      </div>
    </section>
  );
}
