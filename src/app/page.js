"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

const NAME = "M. Usama Khan";
const NOTE_TITLE = "Happy Birthday";
const NOTE_PARAGRAPHS = [
  `To,
  The man who makes his loved ones feel special,
who is good with children and cats and kittens and turtles and etc etc,
who takes care of his Mom and siblings,
who remembers small little details (like how I hate chocolate),
who tries his best to fulfill his family's wishes,
who is expressive through actions, not only through words,
who is ambitious and, most importantly, is a man of principles,
who remembered me while being in the skies,

I've seen so many beautiful sides of you in all these years!
your kindness, your efforts, your dreams, 
and I'm so, so, so proud of the man you were and the man you're becoming. 

Your existence makes this world a better place, and remember that I'm your biggest cheerleader, rooting, and praying for you hameshaaaa

You deserve all the happiness, peace, and success, and may Allah bless your life with endless khair, protect your heart from sadness, and give you success beyond what you imagine.
Ameen.`,
];
const SIGNATURE = "- Yours truly, Jia.";

export default function BirthdayPage() {
  const [step, setStep] = useState("intro");
  const [showTitle, setShowTitle] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [formError, setFormError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isSecondRead, setIsSecondRead] = useState(false);
  const noteRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 500);
    const t2 = setTimeout(() => setStep("popup1"), 6600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleEnded = () => {
      v.currentTime = 0;
      v.play().catch(() => { });
    };
    v.addEventListener("ended", handleEnded);
    return () => v.removeEventListener("ended", handleEnded);
  }, []);

  function handlePleaseSubmit(e) {
    e.preventDefault();
    if (passInput.trim().toLowerCase().includes("please")) {
      setFormError(false);
      setStep("note");
    } else {
      setFormError(true);
    }
  }

  function handleReadAgain() {
    setIsSecondRead(true);
    setPassInput("");
    setFormError(false);
    setStep("popup3");
  }

async function handleDownload() {
  if (!noteRef.current) return;

  setDownloading(true);

  const note = noteRef.current;

  // Save original styles
  const originalMaxHeight = note.style.maxHeight;
  const originalHeight = note.style.height;
  const originalOverflow = note.style.overflow;
  const originalOverflowY = note.style.overflowY;

  try {
    const { toPng } = await import("html-to-image");

    // Temporarily expand the actual note to its full natural height
    note.style.maxHeight = "none";
    note.style.height = "auto";
    note.style.overflow = "visible";
    note.style.overflowY = "visible";

    // Allow browser to recalculate layout
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const width = note.offsetWidth;
    const height = note.scrollHeight;

    const dataUrl = await toPng(note, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#10201c",
      width: width,
      height: height,
    });

    const link = document.createElement("a");
    link.download = "birthday-note.png";
    link.href = dataUrl;
    link.click();

  } catch (err) {
    console.error("Could not generate image", err);

  } finally {
    // Restore original styles
    note.style.maxHeight = originalMaxHeight;
    note.style.height = originalHeight;
    note.style.overflow = originalOverflow;
    note.style.overflowY = originalOverflowY;

    setDownloading(false);
  }
}

  return (
    <main className="bday-root">
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

      {/* title */}
      <div className={`bday-title-wrap ${showTitle ? "is-visible" : ""}`}>
        <span className="bday-eyebrow">wishing you a very</span>
        <h1 className="bday-title">
          Happy Birthday
          {NAME !== "You" && <span className="bday-name">{NAME}</span>}
        </h1>
        {step === "done" && (
          <>
            <span className="bday-sparkle" aria-hidden="true" style={{ marginRight: "6px" }}>
              ✦
            </span>

            <button className="btn btn-read-again" onClick={handleReadAgain}>
              Read Note Again
            </button>

            <span className="bday-sparkle" aria-hidden="true" style={{ marginLeft: "6px" }}>
              ✦
            </span>
          </>
        )}
      </div>

      {/* popup 1 */}
      {step === "popup1" && (
        <Overlay>
          <Popup>
            <p className="popup-text">
              Idk how to skydive, but I know how to code so
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setStep("popup2")}
            >
              A little gift for You!
            </button>
          </Popup>
        </Overlay>
      )}

      {/* popup 2 */}
      {step === "popup2" && (
        <Overlay>
          <Popup>
            <p className="popup-text">
              Do you want to read your birthday note?
            </p>
            <div className="btn-row">
              <button
                className="btn btn-secondary"
                onClick={() => setStep("popup3")}
              >
                Yes
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep("popup3")}
              >
                Obviously, Yes!
              </button>
            </div>
          </Popup>
        </Overlay>
      )}

      {/* popup 3: the "please" form */}
      {step === "popup3" && (
        <Overlay>
          <Popup>
            <p className="popup-text">Say please to open</p>
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
                onFocus={() => setStep(isSecondRead ? "popup3c" : "popup3b")}
                className={`please-input ${formError ? "has-error" : ""}`}
              />
              <button type="submit" className="btn btn-primary">
                Open
              </button>
            </form>
            {formError && (
              <p className="form-error">
                says please piyaar sy
              </p>
            )}
          </Popup>
        </Overlay>
      )}

      {/* popup 3b: birthday pardon (first time) */}
      {step === "popup3b" && (
        <Overlay>
          <Popup>
            <p className="popup-text">
              Today is an exception bcz it's yr birthday
            </p>
            <button className="btn btn-primary" onClick={() => setStep("note")}>
              Maaf kiya!
            </button>
          </Popup>
        </Overlay>
      )}

      {/* popup 3c: second-time pardon */}
      {step === "popup3c" && (
        <Overlay>
          <Popup>
            <p className="popup-text">Dubara maaf kiya </p>
            <button className="btn btn-primary" onClick={() => setStep("note")}>
              Open
            </button>
          </Popup>
        </Overlay>
      )}

      {/* the note itself */}
      {step === "note" && (
        <Overlay dark>
          <button className="note-close" onClick={() => setStep("done")} aria-label="Close note">✕</button>
          <div className="note-card" ref={noteRef}>
            <h2 className="note-title">{NOTE_TITLE}</h2>
            <div className="note-body">
              {NOTE_PARAGRAPHS.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
            <p className="note-signature">{SIGNATURE}</p><br />
            <div className="note-footer">
              <p className="note-hint">
                "Base Order: Save this note to his gallery" <br /><br /> Addendum: No need to burden his
                hands on his birthday by taking a screenshot
              </p><br />
              <button
                className="btn btn-download"
                onClick={async () => {
                  await handleDownload();
                  setStep("done");
                }}
                disabled={downloading}
              >
                {downloading ? "Saving…" : "Roger, SWE!"}
              </button>
            </div><br />
          </div>
        </Overlay>
      )}
    </main>
  );
}

function Overlay({ children, dark }) {
  return (
    <div className={`bday-overlay ${dark ? "is-dark" : ""}`}>{children}</div>
  );
}

function Popup({ children }) {
  return <div className="popup-card">{children}</div>;
}
