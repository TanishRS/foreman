'use client';
/**
 * Station 6 DOM — copy verbatim; the 3D layer supplies the crane-up wide shot
 * with the walking figure. The original solo-operator SVG is kept as the
 * in-flow illustration.
 */
import Reveal from './Reveal';

export default function About() {
  return (
    <section
      id="about"
      data-station="about"
      data-stn="about"
      className="section section--texture"
    >
      <div
        className="wrap grid-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 64,
          alignItems: 'start',
        }}
      >
        <div data-reveal>
          <div className="eyebrow">/ ABOUT</div>
          <Reveal className="display display--h2 reveal-lines">
            One person. On purpose.
          </Reveal>
          <svg
            viewBox="0 0 320 200"
            role="img"
            aria-label="A single operator, standing apart from the system"
            style={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', marginTop: 28 }}
          >
            <g opacity="0.5">
              {[
                [46, 60, 2.5],
                [78, 42, 2],
                [30, 98, 2],
                [68, 110, 2.5],
                [100, 80, 2],
                [38, 140, 2],
                [86, 150, 2.5],
                [112, 120, 2],
                [20, 60, 1.5],
                [60, 20, 1.5],
                [110, 45, 1.5],
                [18, 120, 1.5],
              ].map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--muted)" />
              ))}
            </g>
            <g opacity="0.18" stroke="var(--muted)" strokeWidth="0.75" fill="none">
              <path d="M46 60 L78 42" />
              <path d="M46 60 L30 98" />
              <path d="M68 110 L100 80" />
              <path d="M68 110 L38 140" />
              <path d="M86 150 L112 120" />
              <path d="M100 80 L78 42" />
            </g>
            <circle cx="248" cy="100" r="20" fill="none" stroke="var(--line)" />
            <circle
              cx="248"
              cy="100"
              r="12"
              fill="var(--panel)"
              stroke="var(--accent-mid)"
              strokeWidth="1.75"
            />
            <circle cx="248" cy="100" r="3.5" fill="var(--accent-mid)" />
            <line x1="248" y1="66" x2="248" y2="74" stroke="var(--muted)" />
            <line x1="282" y1="100" x2="274" y2="100" stroke="var(--muted)" />
            <line x1="248" y1="134" x2="248" y2="126" stroke="var(--muted)" />
            <line x1="214" y1="100" x2="222" y2="100" stroke="var(--muted)" />
          </svg>
        </div>
        <div
          data-reveal
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--muted)',
          }}
        >
          <p>
            Foreman is a solo studio. When you hire it, you get the person who
            scopes the work, builds it, and answers when something breaks — not
            an account manager relaying messages to a team you&apos;ll never
            meet.
          </p>
          <p>
            The studio exists because most small businesses don&apos;t need an
            &quot;AI transformation.&quot; They need three or four tedious
            processes to stop eating their week. That&apos;s a plumbing job,
            and it starts with understanding the pipes —{' '}
            <span className="ink">which is why discovery always comes first.</span>
          </p>
          <p>
            Everything is built on tools you can own and inspect: n8n for
            workflows, plain web tech for the rest. If we part ways, the system
            keeps working and the documentation tells the next person exactly
            how.
          </p>
        </div>
      </div>
    </section>
  );
}
