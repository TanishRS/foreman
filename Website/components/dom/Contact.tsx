'use client';
/**
 * Station 7 DOM — power-down. Copy + the three real contact actions verbatim.
 * The one-field intake demoes the product: submitting fires the hero
 * node-graph pulse (scrollBus.intakePulseAt) and opens a prefilled email.
 *
 * FOLLOW-UP: point the submit at the real n8n intake webhook when it exists
 * (POST { message } → workflow), replacing the mailto fallback.
 */
import { useState, type FormEvent } from 'react';
import { scrollBus } from '@/lib/scrollBus';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';

export default function Contact() {
  const [msg, setMsg] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    scrollBus.intakePulseAt = performance.now();
    const body = encodeURIComponent(msg);
    window.location.href = `mailto:foreman.ai.agency@gmail.com?subject=${encodeURIComponent(
      "What's eating my week",
    )}&body=${body}`;
  };

  return (
    <section
      id="contact"
      data-station="contact"
      data-stn="contact"
      className="section section--texture"
      style={{ padding: '110px 40px' }}
    >
      <div
        className="wrap"
        style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'flex-start' }}
      >
        <div className="eyebrow" data-reveal>
          / CONTACT
        </div>
        <Reveal className="display display--giant reveal-lines">
          Tell me what&apos;s eating your week.
        </Reveal>
        <p className="lead" data-reveal style={{ fontSize: 16, maxWidth: '52ch' }}>
          A 30-minute discovery call. You describe how the work flows today;
          I&apos;ll tell you honestly what&apos;s worth automating — and what
          isn&apos;t.
        </p>

        <form className="intake" data-reveal onSubmit={submit}>
          <label className="mono-tiny" htmlFor="intake-msg">
            OR JUST WRITE IT DOWN — THIS FIELD FEEDS THE SAME INTAKE WORKFLOW
            SHOWN IN FIG 01
          </label>
          <textarea
            id="intake-msg"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="e.g. every enquiry sits unanswered until Friday…"
            required
          />
          <button
            type="submit"
            className="btn btn--solid"
            style={{ alignSelf: 'flex-start', border: 'none', cursor: 'pointer' }}
          >
            SEND IT
          </button>
        </form>

        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <MagneticButton href="https://wa.me/917045096649" external>
            MESSAGE ON WHATSAPP
          </MagneticButton>
          <MagneticButton href="mailto:foreman.ai.agency@gmail.com" variant="ghost">
            FOREMAN.AI.AGENCY@GMAIL.COM
          </MagneticButton>
          <MagneticButton href="tel:+917045096649" variant="ghost">
            CALL +91 70450 96649
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
