"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "./actions";

export default function StudioLoginPage() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "sent"; email: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const result = await sendMagicLink(formData);
      if (result.ok) {
        setStatus({ kind: "sent", email });
      } else {
        setStatus({ kind: "error", message: result.error });
      }
    });
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-8">
      <div className="cover-glow" />

      <div
        className="relative z-10 w-full"
        style={{ maxWidth: "26rem" }}
      >
        <div className="flex flex-col items-center mb-12">
          <p className="label">The Atelier</p>
          <div className="rule mx-auto" />
          <h1
            className="serif text-center"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.05,
            }}
          >
            <span className="text-ivory">Sign</span>{" "}
            <span className="text-gold italic">in</span>
          </h1>
        </div>

        {status.kind === "sent" ? (
          <div
            className="border border-[color:var(--gold-line)] p-8 text-center"
            style={{ background: "rgba(196,160,106,0.04)" }}
          >
            <p
              className="serif italic"
              style={{
                fontSize: "1.1rem",
                color: "var(--gold)",
                marginBottom: "1rem",
              }}
            >
              A link is on its way.
            </p>
            <p
              className="serif"
              style={{ color: "var(--ivory-dim)", fontSize: ".95rem", lineHeight: 1.6 }}
            >
              Check{" "}
              <span className="text-ivory">{status.email}</span>{" "}
              and click the link to enter The Atelier.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label
              className="font-sans uppercase text-gold-dim"
              style={{
                fontSize: ".62rem",
                letterSpacing: ".28em",
                fontWeight: 300,
              }}
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@aimcolours.com"
              disabled={pending}
              className="bg-transparent border-b text-ivory outline-none transition-colors"
              style={{
                borderColor: "var(--gold-line)",
                fontFamily: "var(--serif)",
                fontSize: "1.2rem",
                padding: ".6rem 0",
              }}
            />

            <button
              type="submit"
              disabled={pending}
              className="cta mt-6 w-full text-center"
              style={{ cursor: pending ? "wait" : "pointer" }}
            >
              {pending ? "Sending…" : "Send magic link →"}
            </button>

            {status.kind === "error" && (
              <p
                className="serif italic mt-2"
                style={{
                  color: "#d87171",
                  fontSize: ".9rem",
                }}
              >
                {status.message}
              </p>
            )}
          </form>
        )}

        <p
          className="text-center mt-12 font-sans uppercase text-ivory-dim"
          style={{
            fontSize: ".58rem",
            letterSpacing: ".28em",
            fontWeight: 200,
          }}
        >
          The workshop, by invitation only
        </p>
      </div>
    </main>
  );
}
