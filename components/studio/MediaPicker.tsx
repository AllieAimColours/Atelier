"use client";

import { useRef, useState } from "react";

type Status = { kind: "idle" } | { kind: "uploading" } | { kind: "error"; message: string };

// Drag-drop image upload + preview.
// Shows the current image (if any), accepts a new file via drop or click,
// uploads it to /api/upload, and calls onChange with the public URL.
export default function MediaPicker({
  value,
  alt,
  onChange,
  label = "Image",
}: {
  value: string;
  alt?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus({ kind: "uploading" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
      setStatus({ kind: "idle" });
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = ""; // reset so same file can be picked again
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="studio__field">
      <label className="studio__field-label">{label}</label>
      <div
        className={`media-picker${dragOver ? " media-picker--drag" : ""}`}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img
            src={value}
            alt={alt ?? ""}
            className="media-picker__preview"
          />
        ) : (
          <div className="media-picker__placeholder">No image</div>
        )}
        <div className="media-picker__overlay">
          {status.kind === "uploading"
            ? "Uploading…"
            : status.kind === "error"
            ? status.message
            : "Click or drop to replace"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>
      {value && (
        <input
          type="text"
          className="studio__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontSize: ".7rem",
            fontFamily: "ui-monospace, monospace",
            marginTop: ".4rem",
          }}
        />
      )}
    </div>
  );
}
