"use client";

import { useEffect, useState } from "react";

// Self-contained video lightbox. Listens for the global event
// "atelier:open-video" with a CustomEvent.detail = video URL string.
// Any slide can dispatch the event from a click handler — the lightbox
// renders a single fullscreen modal regardless of where it's mounted.
//
// Mount once in the public Deck and once in the Studio SlidePreview so it
// works in both surfaces. The iframe src is cleared on close so playback stops.
export default function VideoLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.length > 0) {
        setSrc(detail);
        setOpen(true);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) close();
    }
    window.addEventListener("atelier:open-video", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("atelier:open-video", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setSrc("");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo video"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(9,8,6,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "88vw",
          maxWidth: "1280px",
          aspectRatio: "16 / 9",
          position: "relative",
        }}
      >
        <iframe
          src={src}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Aim Colours · Demo"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            boxShadow: "0 0 80px rgba(196,160,106,0.15)",
          }}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        style={{
          position: "absolute",
          top: "2.5vh",
          right: "2.5vw",
          background: "transparent",
          border: "1px solid rgba(196,160,106,0.4)",
          color: "#c4a06a",
          fontFamily: "Jost, sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 300,
          padding: "0.65rem 1.4rem",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
