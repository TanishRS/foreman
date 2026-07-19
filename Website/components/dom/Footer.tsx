/**
 * Machine ID plate — quiet ending, single CSS LED loop, copy verbatim.
 * Server-renderable; the only motion is the existing .sq accent square.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="sq" />
        <span>FOREMAN / AI AUTOMATION STUDIO</span>
      </div>
      <div>DISCOVERY FIRST, ALWAYS. © 2026</div>
    </footer>
  );
}
