"use client";

import { useEffect, useRef, useState } from "react";
import type { SlideRecord } from "@/lib/types";

type Message = {
  role: "user" | "assistant";
  text: string;
  proposal?: { content: unknown; summary: string } | null;
};

type Status = { kind: "idle" } | { kind: "thinking" } | { kind: "applying" };

export default function ChatPanel({
  slide,
  onUpdated,
}: {
  slide: SlideRecord;
  onUpdated: (slide: SlideRecord) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset chat history when switching slides
  useEffect(() => {
    setMessages([]);
    setDraft("");
    setStatus({ kind: "idle" });
    setError(null);
  }, [slide.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  async function send() {
    const text = draft.trim();
    if (!text || status.kind !== "idle") return;

    const userMsg: Message = { role: "user", text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setStatus({ kind: "thinking" });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slide,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Chat failed");

      const assistantMsg: Message = {
        role: "assistant",
        text: data.text || (data.proposal ? data.proposal.summary : "(no response)"),
        proposal: data.proposal ?? null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setStatus({ kind: "idle" });
    }
  }

  async function applyProposal(idx: number) {
    const msg = messages[idx];
    if (!msg.proposal) return;
    setStatus({ kind: "applying" });
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: msg.proposal.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Apply failed");
      onUpdated(data.slide as SlideRecord);
      // Mark this proposal as applied (remove the buttons)
      setMessages((prev) =>
        prev.map((m, i) => (i === idx ? { ...m, proposal: null } : m))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setStatus({ kind: "idle" });
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <div className="studio__edit-head">
        <p className="studio__edit-label">Co-pilot</p>
        <h2 className="studio__edit-title">Brainstorm with Claude</h2>
      </div>

      <div className="studio__edit-body chat__body" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat__hint">
            <p>
              Ask anything about <em>{slide.title ?? slide.type}</em>.
            </p>
            <p style={{ marginTop: ".8rem" }}>Try:</p>
            <ul>
              <li>“Make this slide more punchy”</li>
              <li>“Cut 30%”</li>
              <li>“Rewrite the headline for a Chanel audience”</li>
              <li>“What&apos;s missing here for a VC?”</li>
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat__msg chat__msg--${m.role}`}
          >
            <div className="chat__msg-role">
              {m.role === "user" ? "You" : "Claude"}
            </div>
            <div className="chat__msg-text">{m.text}</div>
            {m.proposal && (
              <div className="chat__proposal">
                <div className="chat__proposal-label">Proposed change</div>
                <div className="chat__proposal-summary">
                  {m.proposal.summary}
                </div>
                <button
                  className="studio__btn"
                  disabled={status.kind === "applying"}
                  onClick={() => applyProposal(i)}
                >
                  {status.kind === "applying" ? "Applying…" : "Accept"}
                </button>
              </div>
            )}
          </div>
        ))}

        {status.kind === "thinking" && (
          <div className="chat__msg chat__msg--assistant chat__thinking">
            <div className="chat__msg-role">Claude</div>
            <div className="chat__msg-text">Thinking…</div>
          </div>
        )}

        {error && <div className="chat__error">{error}</div>}
      </div>

      <div className="studio__edit-foot chat__foot">
        <textarea
          ref={inputRef}
          className="chat__input"
          placeholder="Ask Claude…  (Enter to send, Shift+Enter for newline)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          disabled={status.kind !== "idle"}
          rows={2}
        />
        <button
          className="studio__btn"
          onClick={send}
          disabled={!draft.trim() || status.kind !== "idle"}
        >
          Send
        </button>
      </div>
    </>
  );
}
