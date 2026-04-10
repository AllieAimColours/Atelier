"use client";

import type { SlideRecord } from "@/lib/types";
import SlideRenderer from "@/components/deck/SlideRenderer";
import VideoLightbox from "@/components/deck/VideoLightbox";
import "@/components/deck/deck.css";

// Renders a single slide inside a fixed-aspect frame for the Studio preview.
// Reuses the public SlideRenderer + deck styles so the preview is pixel-true.
export default function SlidePreview({ slide }: { slide: SlideRecord }) {
  return (
    <>
      <div className="deck-root">
        <section className="slide active">
          <header className="hd">
            <span className="hd-brand">Aim Colours</span>
            <span className="hd-right">
              {slide.type === "cover"
                ? "Patent Pending · US 63/876,418"
                : `${toRoman(slide.position)} · XII`}
            </span>
          </header>
          <SlideRenderer slide={slide} />
        </section>
      </div>
      <VideoLightbox />
    </>
  );
}

function toRoman(num: number): string {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [v, n] of map) {
    while (num >= v) { result += n; num -= v; }
  }
  return result;
}
