"use client";

import { useEffect, useState } from "react";
import type {
  CoverContent,
  SlideContent,
  SlideRecord,
} from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export default function SlideEditor({
  slide,
  onUpdated,
}: {
  slide: SlideRecord;
  onUpdated: (slide: SlideRecord) => void;
}) {
  const [draft, setDraft] = useState<SlideContent>(slide.content);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dirty = JSON.stringify(draft) !== JSON.stringify(slide.content);

  // Reset draft when switching slides
  useEffect(() => {
    setDraft(slide.content);
    setStatus({ kind: "idle" });
  }, [slide.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onUpdated(data.slide as SlideRecord);
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "idle" }), 2000);
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  function discard() {
    setDraft(slide.content);
    setStatus({ kind: "idle" });
  }

  return (
    <>
      <div className="studio__edit-head">
        <p className="studio__edit-label">Editing</p>
        <h2 className="studio__edit-title">{slide.title ?? slide.type}</h2>
      </div>

      <div className="studio__edit-body">
        {slide.type === "cover" ? (
          <CoverFields
            value={draft as CoverContent}
            onChange={(next) => setDraft(next)}
          />
        ) : (
          <RawJsonField value={draft} onChange={setDraft} type={slide.type} />
        )}
      </div>

      <div className="studio__edit-foot">
        <span
          className={`studio__edit-foot-status${
            status.kind === "error" ? " error" : ""
          }${status.kind === "saved" ? " success" : ""}`}
        >
          {status.kind === "idle" && (dirty ? "Unsaved changes" : "Up to date")}
          {status.kind === "saving" && "Saving…"}
          {status.kind === "saved" && "Saved ✓"}
          {status.kind === "error" && status.message}
        </span>
        <button
          className="studio__btn studio__btn--ghost"
          onClick={discard}
          disabled={!dirty || status.kind === "saving"}
        >
          Discard
        </button>
        <button
          className="studio__btn"
          onClick={save}
          disabled={!dirty || status.kind === "saving"}
        >
          Save
        </button>
      </div>
    </>
  );
}

// ─── Cover editor (proof of concept for typed editing) ───────────────────
function CoverFields({
  value,
  onChange,
}: {
  value: CoverContent;
  onChange: (next: CoverContent) => void;
}) {
  return (
    <>
      <div className="studio__field">
        <label className="studio__field-label">Title (top)</label>
        <input
          className="studio__input"
          value={value.title_top}
          onChange={(e) => onChange({ ...value, title_top: e.target.value })}
        />
      </div>
      <div className="studio__field">
        <label className="studio__field-label">Title (bottom)</label>
        <input
          className="studio__input"
          value={value.title_bottom}
          onChange={(e) => onChange({ ...value, title_bottom: e.target.value })}
        />
      </div>
      <div className="studio__field">
        <label className="studio__field-label">Patent / Header right</label>
        <input
          className="studio__input"
          value={value.patent}
          onChange={(e) => onChange({ ...value, patent: e.target.value })}
        />
      </div>
      <div className="studio__field">
        <label className="studio__field-label">Footer left</label>
        <textarea
          className="studio__textarea"
          rows={2}
          value={value.footer_left}
          onChange={(e) => onChange({ ...value, footer_left: e.target.value })}
        />
      </div>
      <div className="studio__field">
        <label className="studio__field-label">Footer right</label>
        <textarea
          className="studio__textarea"
          rows={2}
          value={value.footer_right}
          onChange={(e) =>
            onChange({ ...value, footer_right: e.target.value })
          }
        />
      </div>
    </>
  );
}

// ─── Raw JSON fallback (for slide types we haven't built typed editors for yet) ───
function RawJsonField({
  value,
  onChange,
  type,
}: {
  value: SlideContent;
  onChange: (next: SlideContent) => void;
  type: string;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  // Sync external value changes (e.g. switching slides)
  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setParseError(null);
  }, [value]);

  function handleChange(next: string) {
    setText(next);
    try {
      const parsed = JSON.parse(next);
      setParseError(null);
      onChange(parsed);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <>
      <div className="studio__stub">
        Typed editor for <strong style={{ color: "var(--gold)" }}>{type}</strong>{" "}
        coming soon. For now, edit the JSON directly.
      </div>
      <div className="studio__field">
        <label className="studio__field-label">Slide content (JSON)</label>
        <textarea
          className="studio__textarea"
          rows={24}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          style={{ fontFamily: "ui-monospace, monospace", fontSize: ".78rem" }}
        />
        {parseError && (
          <p style={{ color: "#d87171", fontSize: ".7rem", marginTop: ".4rem" }}>
            {parseError}
          </p>
        )}
      </div>
    </>
  );
}
