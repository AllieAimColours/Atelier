"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeckBundle, SlideRecord, SlideType } from "@/lib/types";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import SlidePreview from "@/components/studio/SlidePreview";
import SlideEditor from "@/components/studio/SlideEditor";
import ChatPanel from "@/components/studio/ChatPanel";
import "../studio.css";

type Mode = "edit" | "chat";

// Default content templates for each slide type — used when adding a fresh slide
const TEMPLATES: Record<SlideType, { title: string; content: unknown }> = {
  cover: {
    title: "Cover",
    content: {
      title_top: "Brand",
      title_bottom: "Name",
      patent: "",
      footer_left: "",
      footer_right: "",
    },
  },
  problem: {
    title: "The Problem",
    content: {
      label: "The Problem",
      headline_lead: "",
      headline_accent: "",
      two_columns: [{ title: "", body: "" }, { title: "", body: "" }],
      transition: "",
      pull_quote: "",
    },
  },
  vision: {
    title: "The Vision",
    content: {
      label: "The Vision",
      headline_lead: "",
      headline_accent: "",
      image: { src: "", alt: "", caption: "", background: "#ede7db" },
      three_columns: [
        { title: "", body: "" },
        { title: "", body: "" },
        { title: "", body: "" },
      ],
    },
  },
  technology: {
    title: "The Technology",
    content: {
      label: "The Technology",
      headline_lead: "",
      headline_accent: "",
      body: "",
      specs: [{ value: "", label: "" }],
      patent: "",
    },
  },
  experience: {
    title: "The Experience",
    content: {
      label: "The Experience",
      headline_lead: "",
      headline_accent: "",
      numbered_columns: [
        { number: "01", title: "", body: "" },
        { number: "02", title: "", body: "" },
        { number: "03", title: "", body: "" },
      ],
    },
  },
  revenue: {
    title: "Revenue",
    content: {
      label: "Revenue",
      headline_lead: "",
      headline_accent: "",
      pillars: [{ number: "01", title: "", body: "", stat: "" }],
    },
  },
  gtm: {
    title: "Go-to-Market",
    content: {
      label: "Market Entry",
      headline_lead: "",
      headline_accent: "",
      years: [
        { label: "Year One", title: "", body: "", highlight: true },
        { label: "Year Two", title: "", body: "" },
      ],
    },
  },
  traction: {
    title: "Traction",
    content: {
      label: "Validation",
      big_statement_lead: "",
      big_statement_accent: "",
      footnote: "",
    },
  },
  market: {
    title: "Market",
    content: {
      label: "The Opportunity",
      metrics: [
        { label: "TAM", value: "", desc: "" },
        { label: "SAM", value: "", desc: "" },
        { label: "SOM", value: "", desc: "" },
      ],
      statement: { lead: "", mid: "", accent: "" },
      right: { label: "Why We Win", headline: "", moat: [] },
    },
  },
  roadmap: {
    title: "Roadmap",
    content: {
      label: "The Road Ahead",
      headline_lead: "",
      headline_accent: "",
      phases: [
        { label: "", title: "", body: "" },
      ],
      beyond: { label: "", phase: "", body: "" },
    },
  },
  team: {
    title: "Team",
    content: {
      label: "The Team",
      members: [],
      partners: [],
    },
  },
  close: {
    title: "Close",
    content: {
      left: {
        label: "An Invitation",
        statement_lines: [],
        statement_accent_lines: [],
        links: [],
      },
      right: {
        label: "The Ask",
        amount: "$0",
        raise_meta: "",
        use_of_funds: [],
        unlocks_label: "What this unlocks",
        unlocks_body: "",
        footer_lines: [],
      },
    },
  },
};

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
  const [mode, setMode] = useState<Mode>("edit");
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const current = slides[currentIdx];

  function onSlideUpdated(updated: SlideRecord) {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  // ─── add a new slide of a given type at the end ───
  async function addSlide(type: SlideType) {
    setShowAdd(false);
    setBusy(true);
    const tpl = TEMPLATES[type];
    const position = slides.length + 1;
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deck_id: bundle.deck.id,
          position,
          type,
          title: tpl.title,
          content: tpl.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Add failed");
      const newSlides = [...slides, data.slide as SlideRecord];
      setSlides(newSlides);
      setCurrentIdx(newSlides.length - 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Add failed");
    } finally {
      setBusy(false);
    }
  }

  // ─── duplicate the slide at idx ───
  async function duplicateSlide(idx: number) {
    const src = slides[idx];
    if (!src) return;
    setBusy(true);
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deck_id: bundle.deck.id,
          position: src.position + 1,
          type: src.type,
          title: src.title ? `${src.title} (copy)` : null,
          content: src.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Duplicate failed");
      // Refetch all slides to get the post-shift positions
      await refetchSlides();
      setCurrentIdx(idx + 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Duplicate failed");
    } finally {
      setBusy(false);
    }
  }

  // ─── delete the slide at idx ───
  async function deleteSlide(idx: number) {
    const target = slides[idx];
    if (!target) return;
    if (!confirm(`Delete slide ${target.position} (${target.type})?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/slides/${target.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      await refetchSlides();
      setCurrentIdx(Math.max(0, Math.min(idx, slides.length - 2)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  // ─── reorder: move idx by ±1 ───
  async function moveSlide(idx: number, dir: -1 | 1) {
    const a = slides[idx];
    const b = slides[idx + dir];
    if (!a || !b) return;
    setBusy(true);
    try {
      // Two-step swap to avoid (deck_id, position) unique conflicts
      // 1. set a.position to a placeholder (-1) freeing up its slot
      await fetch(`/api/slides/${a.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ position: -1 }),
      });
      // 2. move b into a's old position
      await fetch(`/api/slides/${b.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ position: a.position }),
      });
      // 3. move a into b's old position
      await fetch(`/api/slides/${a.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ position: b.position }),
      });
      await refetchSlides();
      setCurrentIdx(idx + dir);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  // ─── refetch all slides for the current deck ───
  async function refetchSlides() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("slides")
      .select("*")
      .eq("deck_id", bundle.deck.id)
      .order("position", { ascending: true });
    if (data) setSlides(data as SlideRecord[]);
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
              <div className="studio__list-actions">
                <button
                  className="studio__list-action"
                  title="Move up"
                  disabled={busy || i === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSlide(i, -1);
                  }}
                >
                  ↑
                </button>
                <button
                  className="studio__list-action"
                  title="Move down"
                  disabled={busy || i === slides.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSlide(i, 1);
                  }}
                >
                  ↓
                </button>
                <button
                  className="studio__list-action"
                  title="Duplicate"
                  disabled={busy}
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(i);
                  }}
                >
                  ⎘
                </button>
                <button
                  className="studio__list-action studio__list-action--danger"
                  title="Delete"
                  disabled={busy || slides.length <= 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(i);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Add slide */}
          <div style={{ padding: "0.8rem 1.4rem 1.4rem" }}>
            {showAdd ? (
              <div className="studio__add-menu">
                <div
                  className="studio__field-label"
                  style={{ marginBottom: ".5rem" }}
                >
                  Pick a type
                </div>
                {(Object.keys(TEMPLATES) as SlideType[]).map((t) => (
                  <button
                    key={t}
                    className="studio__add-option"
                    disabled={busy}
                    onClick={() => addSlide(t)}
                  >
                    {t}
                  </button>
                ))}
                <button
                  className="studio__btn studio__btn--ghost"
                  style={{ marginTop: ".5rem", width: "100%" }}
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="studio__btn studio__btn--ghost"
                style={{ width: "100%" }}
                disabled={busy}
                onClick={() => setShowAdd(true)}
              >
                + Add slide
              </button>
            )}
          </div>
        </aside>

        {/* ─── live preview ─── */}
        <div className="studio__preview">
          <div className="studio__preview-frame">
            {current && <SlidePreview slide={current} />}
          </div>
        </div>

        {/* ─── edit / chat panel ─── */}
        <aside className="studio__edit">
          <div className="studio__tabs">
            <button
              className={`studio__tab${mode === "edit" ? " active" : ""}`}
              onClick={() => setMode("edit")}
            >
              Edit
            </button>
            <button
              className={`studio__tab${mode === "chat" ? " active" : ""}`}
              onClick={() => setMode("chat")}
            >
              Co-pilot
            </button>
          </div>
          {current && mode === "edit" && (
            <SlideEditor slide={current} onUpdated={onSlideUpdated} />
          )}
          {current && mode === "chat" && (
            <ChatPanel slide={current} onUpdated={onSlideUpdated} />
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
