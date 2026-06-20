'use client';

import { useEffect, useRef, useState } from 'react';
import './globals.css';

/**
 * ───────────────────────────────────────────────────────────
 *  EDIT ME: personalise the note + name here
 * ───────────────────────────────────────────────────────────
 */
const NAME = 'Pretty Baby'; 
const NOTE_TITLE = 'With Love';
const NOTE_PARAGRAPHS = [
  `I'm not great with grand gestures — no skydiving, no surprise trip, no balloons falling from a ceiling. But I know how to sit with an idea until it works, line by line, until it feels right. So this is that, built quietly for you.`,
  `Today isn't really about cake or candles, even though those are nice too. It's a small marker that says: another year of you happened, and the world is better for it. The people around you got to keep you a little longer, and that's worth celebrating properly.`,
  `Wherever this year takes you, I hope it's kinder than the last one, louder where you want it loud, and quiet where you need rest. I hope you laugh at things that don't even make sense to anyone else in the room.`,
  `Happy birthday. Here's to you — exactly as you are, not as anyone needed you to be.`,
];
const SIGNATURE = '— with care, always';

export default function BirthdayPage() {
  // steps: intro -> popup1 -> popup2 -> popup3 -> note
  const [step, setStep] = useState('intro');
  const [showTitle, setShowTitle] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [formError, setFormError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const noteRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 500);
    const t2 = setTimeout(() => setStep('popup1'), 10600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    // make sure video keeps looping seamlessly even if browser pauses it
    const v = videoRef.current;
    if (!v) return;
    const handleEnded = () => {
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    v.addEventListener('ended', handleEnded);
    return () => v.removeEventListener('ended', handleEnded);
  }, []);

  function handlePleaseSubmit(e) {
    e.preventDefault();
    if (passInput.trim().toLowerCase().includes('please')) {
      setFormError(false);
      setStep('note');
    } else {
      setFormError(true);
    }
  }

  async function handleDownload() {
    if (!noteRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(noteRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#10201c',
      });
      const link = document.createElement('a');
      link.download = 'birthday-note.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not generate image', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="bday-root">
      {/* ── continuous looping video background ── */}
      <video
        ref={videoRef}
        className="bday-video"
        src="/bg-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="bday-veil" />

      {/* ── title ── */}
      <div className={`bday-title-wrap ${showTitle ? 'is-visible' : ''}`}>
        <span className="bday-eyebrow">wishing you</span>
        <h1 className="bday-title">
          Happy Birthday
          {NAME !== 'You' && <span className="bday-name">{NAME}</span>}
        </h1>
        <span className="bday-sparkle" aria-hidden="true">✦</span>
      </div>

      {/* ── popup 1 ── */}
      {step === 'popup1' && (
        <Overlay>
          <Popup>
            <p className="popup-text">
              I don&rsquo;t know how to skydive, but I know how to code —
              so this is a small gesture instead.
            </p>
            <button className="btn btn-primary" onClick={() => setStep('popup2')}>
              Okay
            </button>
          </Popup>
        </Overlay>
      )}

      {/* ── popup 2 ── */}
      {step === 'popup2' && (
        <Overlay>
          <Popup>
            <p className="popup-text">Do you want to see your birthday note?</p>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => setStep('popup3')}>
                Yes
              </button>
              <button className="btn btn-secondary" onClick={() => setStep('popup3')}>
                Obviously yes
              </button>
            </div>
          </Popup>
        </Overlay>
      )}

      {/* ── popup 3: the "please" form ── */}
      {step === 'popup3' && (
        <Overlay>
          <Popup>
            <p className="popup-text">Say please to open.</p>
            <form
              className="please-form"
              onSubmit={handlePleaseSubmit}
              onChange={() => setFormError(false)}
            >
              <input
                type="text"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="please..."
                autoFocus
                className={`please-input ${formError ? 'has-error' : ''}`}
              />
              <button type="submit" className="btn btn-primary">
                Open
              </button>
            </form>
            {formError && (
              <p className="form-error">that didn&rsquo;t sound like a please — try again</p>
            )}
          </Popup>
        </Overlay>
      )}

      {/* ── the note itself ── */}
      {step === 'note' && (
        <Overlay dark>
          <div className="note-card" ref={noteRef}>
            <span className="note-kicker">your note</span>
            <h2 className="note-title">{NOTE_TITLE}</h2>
            <div className="note-body">
              {NOTE_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="note-signature">{SIGNATURE}</p>
            <div className="note-footer">
              <p className="note-hint">
                Don&rsquo;t worry, no need to take a screenshot —
              </p>
              <button
                className="btn btn-download"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? 'Saving…' : 'Click here to download the note'}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </main>
  );
}

function Overlay({ children, dark }) {
  return <div className={`bday-overlay ${dark ? 'is-dark' : ''}`}>{children}</div>;
}

function Popup({ children }) {
  return <div className="popup-card">{children}</div>;
}