export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="cover-glow" />

      {/* Top brand bar */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 pt-10">
        <span
          className="font-sans uppercase text-ivory"
          style={{ fontSize: "0.78rem", letterSpacing: "0.32em", fontWeight: 300 }}
        >
          Aim Colours
        </span>
        <span
          className="font-sans uppercase text-gold-dim"
          style={{ fontSize: "0.62rem", letterSpacing: "0.28em", fontWeight: 200 }}
        >
          The Atelier
        </span>
      </header>

      {/* Centered cover */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <p className="label fade-up">In Construction</p>
        <div
          className="rule mx-auto draw-line"
          style={{ marginTop: "0.5rem", marginBottom: "2rem" }}
        />

        <h1
          className="serif fade-up delay-1"
          style={{
            fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1.05,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          <span className="text-ivory">The</span>{" "}
          <span className="text-gold italic">Atelier</span>
        </h1>

        <p
          className="serif fade-up delay-2 mt-8 max-w-2xl text-ivory-dim"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.4rem)",
            lineHeight: 1.5,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          The workshop where the maison&apos;s pitch is built.
          <br />
          One deck, many houses. AI at your shoulder.
        </p>

        <div
          className="fade-up delay-3 mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="/pitch/default"
            className="border border-[color:var(--gold)] px-8 py-3 transition-colors hover:bg-[color:var(--gold)]"
            style={{
              display: "inline-block",
              textDecoration: "none",
              color: "var(--ivory)",
            }}
          >
            <span
              className="font-sans uppercase"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                fontWeight: 300,
              }}
            >
              View the deck →
            </span>
          </a>
          <a
            href="/studio"
            className="border border-[color:var(--gold-line)] px-8 py-3 transition-colors hover:border-[color:var(--gold)]"
            style={{
              display: "inline-block",
              textDecoration: "none",
              color: "var(--gold-dim)",
            }}
          >
            <span
              className="font-sans uppercase"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                fontWeight: 300,
              }}
            >
              Enter the Atelier
            </span>
          </a>
        </div>
      </section>

      {/* Foot */}
      <footer className="relative z-10 px-8 md:px-16 pb-10 fade-up delay-4">
        <div className="flex justify-between items-end gap-6 flex-wrap">
          <p
            className="serif text-ivory-dim"
            style={{ fontSize: "0.85rem", lineHeight: 1.55, fontStyle: "italic" }}
          >
            The house that moves first
            <br />
            owns the category.
          </p>
          <p
            className="font-sans uppercase text-ivory-dim text-right"
            style={{ fontSize: "0.62rem", letterSpacing: "0.22em", fontWeight: 200 }}
          >
            Built for investors and maisons
            <br />
            MMXXVI
          </p>
        </div>
      </footer>
    </main>
  );
}
