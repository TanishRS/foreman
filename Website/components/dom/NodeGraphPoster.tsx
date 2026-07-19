/**
 * Static FIG 01 poster — the original site's SVG workflow diagram, preserved
 * as (a) the hero placeholder while the WebGL scene streams in and (b) the
 * permanent no-WebGL fallback. Server-renderable, zero JS.
 */
export default function NodeGraphPoster() {
  return (
    <svg
      viewBox="0 0 680 430"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Automation workflow diagram"
    >
      {/* edges */}
      <path d="M180 88 L260 88" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      <path d="M340 116 L340 200" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      <path d="M420 88 L500 88" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      <path d="M420 228 L500 228" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      <path d="M340 256 L340 340" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      <path d="M580 256 L580 340" stroke="var(--line)" strokeWidth="1.5" fill="none" />
      {[
        { x: 20, y: 60, name: 'trigger', sub: 'new enquiry' },
        { x: 260, y: 60, name: 'n8n', sub: 'route + enrich' },
        { x: 500, y: 60, name: 'crm', sub: 'create record' },
        { x: 260, y: 200, name: 'claude', sub: 'qualify lead' },
        { x: 500, y: 200, name: 'email', sub: 'draft reply' },
        { x: 260, y: 340, name: 'notify', sub: 'WhatsApp ping' },
        { x: 500, y: 340, name: 'sheet', sub: 'log row' },
      ].map((n) => (
        <g key={n.name}>
          <rect
            x={n.x}
            y={n.y}
            width="160"
            height="56"
            rx="6"
            fill="var(--panel)"
            stroke="var(--line)"
          />
          <circle cx={n.x + 20} cy={n.y + 28} r="3.5" fill="var(--accent)" />
          <text
            x={n.x + 36}
            y={n.y + 24}
            fontFamily="var(--font-mono)"
            fontSize="12"
            fill="var(--ink)"
          >
            {n.name}
          </text>
          <text
            x={n.x + 36}
            y={n.y + 41}
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill="var(--muted)"
          >
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
