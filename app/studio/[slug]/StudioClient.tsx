"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeckBundle, SlideRecord } from "@/lib/types";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import SlidePreview from "@/components/studio/SlidePreview";
import SlideEditor from "@/components/studio/SlideEditor";
import "../studio.css";

export default function StudioClient({
  bundle,
  userEmail,
}: {
  bundle: DeckBundle;
  userEmail: string;
}) {
  const router = useRouter();
  const [slides, setSlides] = useState(bundle.slides);
  const [currentIdx, setCurrentIdx] = useState(0);
  const current = slides[currentIdx];

  function onSlideUpdated(updated: SlideRecord) {
    setSlides((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }

  async function signOut() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <div className="studio">
      {/* ─── top bar ─── */}
      <header className="studio__top">
        <div className="studio__brand">
          <span className="studio__brand-name">The Atelier</span>
          <span className="studio__brand-sub">
            {bundle.deck.name}
            {bundle.audience && ` · for ${bundle.audience.name}`}
          </span>
        </div>
        <div className="studio__top-right">
          <a
            href={`/pitch/${bundle.deck.slug}`}
            target="_blank"
            rel="noopener"
            className="studio__signout"
            style={{ textDecoration: "none" }}
          >
            View live ↗
          </a>
          <span className="studio__user">{userEmail}</span>
          <button className="studio__signout" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* ─── 3-pane body ─── */}
      <div className="studio__body">
        {/* ─── slide list ─── */}
        <aside className="studio__list">
          <div className="studio__list-label">Slides</div>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`studio__list-item${i === currentIdx ? " active" : ""}`}
              onClick={() => setCurrentIdx(i)}
            >
              <span className="studio__list-num">{toRoman(slide.position)}</span>
              <div className="studio__list-text">
                <span className="studio__list-title">
                  {slide.title ?? slide.type}
                </span>
                <span className="studio__list-type">{slide.type}</span>
              </div>
            </div>
          ))}
        </aside>

        {/* ─── live preview ─── */}
        <div className="studio__preview">
          <div className="studio__preview-frame">
            {current && <SlidePreview slide={current} />}
          </div>
        </div>

        {/* ─── edit panel ─── */}
        <aside className="studio__edit">
          {current && (
            <SlideEditor slide={current} onUpdated={onSlideUpdated} />
          )}
        </aside>
      </div>
    </div>
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
