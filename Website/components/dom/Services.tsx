'use client';
/**
 * Station 1 DOM — HUD copy panels over the two machine stations.
 * All copy verbatim from the original site.
 */
import Reveal from './Reveal';

export default function Services() {
  return (
    <section id="services" data-station="services" data-stn="services" className="section">
      <div className="wrap">
        <div className="eyebrow" data-reveal>
          / SERVICES
        </div>
        <Reveal className="display display--h2 reveal-lines">
          Two things, done properly.
        </Reveal>
        <div
          className="grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginTop: 48,
          }}
        >
          <div className="card" data-reveal>
            <svg
              width="72"
              height="72"
              viewBox="0 0 200 200"
              role="img"
              aria-label="Automation workflows icon"
            >
              <circle cx="100" cy="100" r="66" fill="none" stroke="var(--line)" />
              {[
                [100, 34],
                [155, 68],
                [155, 132],
                [100, 166],
                [45, 132],
                [45, 68],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <path
                    d={`M100 100 L${x} ${y}`}
                    stroke="var(--line)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx={x} cy={y} r="2" fill="var(--muted)" />
                </g>
              ))}
              <circle
                cx="100"
                cy="100"
                r="15"
                fill="var(--panel)"
                stroke="var(--accent-mid)"
                strokeWidth="1.5"
              />
              <circle cx="100" cy="100" r="4" fill="var(--accent-mid)" />
            </svg>
            <div className="mono-label">01 / AUTOMATION BUILDS</div>
            <h3
              className="display"
              style={{ fontSize: 34 }}
            >
              Custom n8n workflows
            </h3>
            <p className="lead">
              Lead intake, quote follow-ups, invoicing chases, report
              generation, AI-assisted triage, all wired into the tools you
              already use. Built on n8n so you own it, documented so you
              understand it.
            </p>
            <div className="chips" style={{ marginTop: 'auto', paddingTop: 10 }}>
              <span className="chip">n8n</span>
              <span className="chip">claude / llm</span>
              <span className="chip">webhooks + apis</span>
              <span className="chip">crm / sheets / email</span>
            </div>
          </div>

          <div className="card" data-reveal>
            <svg
              width="72"
              height="72"
              viewBox="0 0 200 200"
              role="img"
              aria-label="Web systems icon"
            >
              <rect
                x="28"
                y="34"
                width="144"
                height="132"
                rx="6"
                fill="var(--panel)"
                stroke="var(--line)"
                strokeWidth="1.5"
              />
              <line x1="28" y1="58" x2="172" y2="58" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="42" cy="46" r="2.5" fill="var(--muted)" />
              <circle cx="52" cy="46" r="2.5" fill="var(--muted)" />
              <circle cx="62" cy="46" r="2.5" fill="var(--muted)" />
              <rect x="44" y="72" width="52" height="6" fill="var(--muted)" opacity="0.55" />
              <rect
                x="44"
                y="86"
                width="112"
                height="18"
                rx="3"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1.5"
              />
              <rect x="44" y="114" width="52" height="6" fill="var(--muted)" opacity="0.55" />
              <rect
                x="44"
                y="128"
                width="112"
                height="18"
                rx="3"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1.5"
              />
              <rect
                x="130"
                y="150"
                width="26"
                height="10"
                rx="2"
                fill="none"
                stroke="var(--accent-mid)"
                strokeWidth="1.5"
              />
            </svg>
            <div className="mono-label">02 / WEB SYSTEMS</div>
            <h3 className="display" style={{ fontSize: 34 }}>
              Sites &amp; internal tools
            </h3>
            <p className="lead">
              Fast sites, booking and intake forms, dashboards, and small
              internal tools, built to feed your automations instead of
              sitting next to them. One system, not a pile of disconnected
              apps.
            </p>
            <div className="chips" style={{ marginTop: 'auto', paddingTop: 10 }}>
              <span className="chip">sites + landing pages</span>
              <span className="chip">forms + intake</span>
              <span className="chip">dashboards</span>
              <span className="chip">internal tools</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
