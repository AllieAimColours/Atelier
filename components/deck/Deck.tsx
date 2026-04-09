"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeckBundle } from "@/lib/types";
import SlideRenderer from "./SlideRenderer";
import "./deck.css";

export default function Deck({ bundle }: { bundle: DeckBundle }) {
  const { deck, slides, audience } = bundle;
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      setCurrent(next);
    },
    [total]
  );

  // ─── keyboard nav ───
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, total, go]);

  // ─── basic touch swipe ───
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) go(current + 1);
        else go(current - 1);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, go]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="deck-root">
        {slides.map((slide, i) => (
        <section
          key={slide.id}
          className={`slide${i === current ? " active" : ""}`}
        >
          <header className="hd">
            <span className="hd-brand">
              {audience ? `Aim Colours · ${audience.name}` : "Aim Colours"}
            </span>
            <span className="hd-right">
              {slide.type === "cover"
                ? "Patent Pending · US 63/876,418"
                : `${toRoman(slide.position)} · ${toRoman(total)}`}
            </span>
          </header>
          <SlideRenderer slide={slide} />
        </section>
      ))}

      {/* dot nav */}
      <div className="nav">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`nd${i === current ? " active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* prev/next */}
      <div className="arrows">
        <button className="ab" onClick={() => go(current - 1)}>
          ← Prev
        </button>
        <button className="ab" onClick={() => go(current + 1)}>
          Next →
        </button>
      </div>
      </div>
    </div>
  );
}

// ─── helpers ───
function toRoman(num: number): string {
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, numeral] of map) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}
