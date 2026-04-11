"use client";

import { ReactNode } from "react";

// ─── Reusable form primitives for the Studio editors ─────────────────────
// Tiny, brand-styled, designed to compose into per-slide-type editors.

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="studio__field">
      <label className="studio__field-label">{label}</label>
      <input
        type="text"
        className="studio__input"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="studio__field">
      <label className="studio__field-label">{label}</label>
      <textarea
        className="studio__textarea"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Repeater for arrays of objects (e.g. specs, members, pillars) ───────
export function Repeater<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
  itemTitle,
}: {
  label: string;
  items: T[] | undefined | null;
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  itemTitle?: (item: T, index: number) => string;
}) {
  // Null-safe: if items is undefined, treat it as an empty array
  const safeItems: T[] = Array.isArray(items) ? items : [];

  function update(idx: number, next: T) {
    onChange(safeItems.map((it, i) => (i === idx ? next : it)));
  }
  function remove(idx: number) {
    onChange(safeItems.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= safeItems.length) return;
    const copy = [...safeItems];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  }
  function add() {
    onChange([...safeItems, newItem()]);
  }

  return (
    <div className="studio__field">
      <label className="studio__field-label">{label}</label>
      <div className="repeater">
        {safeItems.map((item, i) => (
          <div key={i} className="repeater__item">
            <div className="repeater__head">
              <span className="repeater__index">
                {itemTitle ? itemTitle(item, i) : `${i + 1}`}
              </span>
              <div className="repeater__actions">
                <button
                  type="button"
                  className="repeater__btn"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="repeater__btn"
                  onClick={() => move(i, 1)}
                  disabled={i === safeItems.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="repeater__btn repeater__btn--danger"
                  onClick={() => remove(i)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="repeater__body">
              {renderItem(item, (next) => update(i, next), i)}
            </div>
          </div>
        ))}
        <button type="button" className="repeater__add" onClick={add}>
          + Add item
        </button>
      </div>
    </div>
  );
}

// ─── Lines editor (string[] — used for statement_lines etc.) ────────────
export function LinesField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string[] | undefined | null;
  onChange: (next: string[]) => void;
  rows?: number;
}) {
  return (
    <TextArea
      label={label}
      value={(value ?? []).join("\n")}
      onChange={(text) => onChange(text.split("\n"))}
      rows={rows}
    />
  );
}
