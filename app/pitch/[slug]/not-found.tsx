import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="label">Not Found</p>
      <div className="rule mx-auto" style={{ marginBottom: "1.5rem" }} />
      <h1
        className="serif"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 400,
          color: "var(--ivory)",
        }}
      >
        This deck does not exist.
      </h1>
      <p
        className="serif italic mt-4"
        style={{
          color: "var(--ivory-dim)",
          fontSize: "1rem",
          maxWidth: "32rem",
        }}
      >
        Either the slug is wrong, the deck is unpublished, or it has yet to be
        built in The Atelier.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-2 border border-[color:var(--gold-line)]"
        style={{
          fontFamily: "var(--sans)",
          fontSize: ".7rem",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: "var(--gold-dim)",
        }}
      >
        Return to Atelier
      </Link>
    </main>
  );
}
