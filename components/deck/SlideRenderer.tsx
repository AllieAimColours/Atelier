import type {
  CloseContent,
  CoverContent,
  ExperienceContent,
  GtmContent,
  MarketContent,
  ProblemContent,
  RevenueContent,
  RoadmapContent,
  SlideRecord,
  TeamContent,
  TechnologyContent,
  TractionContent,
  VisionContent,
} from "@/lib/types";

export default function SlideRenderer({ slide }: { slide: SlideRecord }) {
  switch (slide.type) {
    case "cover":
      return <Cover content={slide.content as CoverContent} />;
    case "problem":
      return <Problem content={slide.content as ProblemContent} />;
    case "vision":
      return <Vision content={slide.content as VisionContent} />;
    case "technology":
      return <Technology content={slide.content as TechnologyContent} />;
    case "experience":
      return <Experience content={slide.content as ExperienceContent} />;
    case "revenue":
      return <Revenue content={slide.content as RevenueContent} />;
    case "gtm":
      return <Gtm content={slide.content as GtmContent} />;
    case "traction":
      return <Traction content={slide.content as TractionContent} />;
    case "market":
      return <Market content={slide.content as MarketContent} />;
    case "roadmap":
      return <Roadmap content={slide.content as RoadmapContent} />;
    case "team":
      return <Team content={slide.content as TeamContent} />;
    case "close":
      return <Close content={slide.content as CloseContent} />;
    default:
      return <div className="body">Unknown slide type: {slide.type}</div>;
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────
function renderInline(text: string | undefined | null) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMultiline(text: string | undefined | null) {
  if (!text) return null;
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {renderInline(line)}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ─── S1 · COVER ───────────────────────────────────────────────────────────
function Cover({ content }: { content: CoverContent }) {
  function openVideo() {
    if (typeof window === "undefined" || !content.demo_video_url) return;
    window.dispatchEvent(
      new CustomEvent("atelier:open-video", { detail: content.demo_video_url })
    );
  }

  return (
    <>
      <div className="cover-glow" />
      <div
        className="body"
        style={{ justifyContent: "center", gap: "3cqh" }}
      >
        <h1 className="cover-title">
          <span className="ivory">{content.title_top}</span>
          <br />
          <span className="gold">{content.title_bottom}</span>
        </h1>
        {content.demo_cta_label && content.demo_video_url && (
          <button
            type="button"
            onClick={openVideo}
            className="cta"
            style={{ alignSelf: "center" }}
          >
            {content.demo_cta_label}
          </button>
        )}
      </div>
      <div className="cover-foot">
        <p className="cover-left">{renderMultiline(content.footer_left)}</p>
        <p className="cover-right">{renderMultiline(content.footer_right)}</p>
      </div>
    </>
  );
}

// ─── S2 · PROBLEM ─────────────────────────────────────────────────────────
function Problem({ content }: { content: ProblemContent }) {
  return (
    <div className="body" style={{ gap: "2.4cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-xl" style={{ maxWidth: "80%" }}>
          {content.headline_lead}
          <br />
          <span className="gold em">{content.headline_accent}</span>
        </h2>
      </div>

      <div className="rule-full" />

      <div className="g2" style={{ gap: "5cqw", alignItems: "end" }}>
        {(content.two_columns ?? []).map((col, i) => (
          <div key={i}>
            <p className="label" style={{ marginBottom: ".7rem" }}>
              {col.title}
            </p>
            <p className="body-s">{renderInline(col.body)}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          paddingTop: "1.6cqh",
          borderTop: "1px solid var(--gold-line)",
        }}
      >
        <p
          className="body-s"
          style={{ color: "var(--ivory)", lineHeight: 1.7 }}
        >
          {content.transition}
        </p>
      </div>

      <div className="pq">{renderMultiline(content.pull_quote)}</div>
    </div>
  );
}

// ─── S3 · VISION ──────────────────────────────────────────────────────────
function Vision({ content }: { content: VisionContent }) {
  return (
    <div
      className="body"
      style={{ gap: 0, paddingTop: "2cqh", overflow: "hidden" }}
    >
      <div style={{ flexShrink: 0, paddingBottom: "1.6cqh" }}>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2
          className="serif"
          style={{
            fontSize: "clamp(1.8rem,3.8cqw,3.6rem)",
            lineHeight: 1.1,
            color: "var(--ivory)",
          }}
        >
          {content.headline_lead}
          <br />
          <span className="gold em">{content.headline_accent}</span>
        </h2>
      </div>

      {content.image && (
        <div
          style={{
            width: "100%",
            background: content.image?.background ?? "#ede7db",
            flexShrink: 0,
            height: "34cqh",
            overflow: "hidden",
            borderRadius: "3px",
            position: "relative",
          }}
        >
          {content.image?.src && (
            <img
              src={content.image?.src}
              alt={content.image?.alt ?? ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center center",
              }}
            />
          )}
          {content.image?.caption && (
            <div style={{ position: "absolute", bottom: ".6rem", right: "1rem" }}>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 200,
                  fontSize: ".52rem",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "rgba(45,31,20,.72)",
                }}
              >
                {content.image?.caption}
              </p>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "2.5cqw",
          paddingTop: "2cqh",
          flex: 1,
        }}
      >
        {(content.three_columns ?? []).map((col, i) => (
          <div
            key={i}
            style={{
              borderTop: "1px solid var(--gold-line)",
              paddingTop: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(.95rem,1.3cqw,1.2rem)",
                fontWeight: 400,
                color: "var(--gold)",
                marginBottom: ".5rem",
              }}
            >
              {col.title}
            </p>
            <p className="body-s">{col.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S4 · TECHNOLOGY ──────────────────────────────────────────────────────
function Technology({ content }: { content: TechnologyContent }) {
  return (
    <div className="body" style={{ gap: "2.4cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-lg" style={{ maxWidth: "96%" }}>
          {content.headline_lead}
          <br />
          <span className="gold">{content.headline_accent}</span>
        </h2>
      </div>
      <p className="body-s" style={{ maxWidth: "80%" }}>
        {content.body}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "2cqw",
          paddingTop: "1cqh",
        }}
      >
        {(content.specs ?? []).map((spec, i) => (
          <div className="spec" key={i}>
            <div className="spec-v">{spec.value}</div>
            <div className="spec-l">{spec.label}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "1cqh",
          border: "1px solid var(--gold-line)",
          padding: ".35rem 1rem",
          display: "inline-block",
          alignSelf: "flex-start",
        }}
      >
        <p
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 200,
            fontSize: ".82rem",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "var(--gold-dim)",
          }}
        >
          {content.patent}
        </p>
      </div>
    </div>
  );
}

// ─── S5 · EXPERIENCE ──────────────────────────────────────────────────────
function Experience({ content }: { content: ExperienceContent }) {
  return (
    <div className="body" style={{ gap: "3.5cqh", justifyContent: "center" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-lg" style={{ maxWidth: "88%" }}>
          {content.headline_lead}
          <br />
          <span className="gold">{content.headline_accent}</span>
        </h2>
      </div>
      <div className="g3" style={{ alignItems: "start", gap: "3cqw" }}>
        {(content.numbered_columns ?? []).map((col, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              borderTop: "1px solid var(--gold-line)",
              paddingTop: "1.4rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: "2.6rem",
                fontWeight: 300,
                color: "var(--gold)",
                opacity: 0.28,
                lineHeight: 1,
              }}
            >
              {col.number}
            </div>
            <p
              className="serif d-md"
              style={{ color: "var(--ivory)", lineHeight: 1.2 }}
            >
              {col.title}
            </p>
            <p className="body-s">{col.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S6 · REVENUE ─────────────────────────────────────────────────────────
function Revenue({ content }: { content: RevenueContent }) {
  return (
    <div className="body" style={{ gap: "2.4cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-lg" style={{ maxWidth: "82%" }}>
          {content.headline_lead}
          <br />
          <span className="gold">{content.headline_accent}</span>
        </h2>
      </div>
      <div className="g4">
        {(content.pillars ?? []).map((p, i) => (
          <div className="pillar" key={i}>
            <div className="p-num">{p.number}</div>
            <div className="p-title">{p.title}</div>
            <p className="p-body">{p.body}</p>
            <p className="p-stat">{p.stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S7 · GO-TO-MARKET ────────────────────────────────────────────────────
function Gtm({ content }: { content: GtmContent }) {
  return (
    <div className="body" style={{ gap: "2.4cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-lg" style={{ maxWidth: "82%" }}>
          {content.headline_lead}
          <br />
          <span className="gold">{content.headline_accent}</span>
        </h2>
      </div>
      <div className="g4" style={{ gap: "2cqw" }}>
        {(content.years ?? []).map((y, i) => (
          <div
            key={i}
            className="yr"
            style={y.highlight ? { borderTopColor: "var(--gold)" } : undefined}
          >
            <div className="yr-l">{y.label}</div>
            <div className="yr-m">{y.title}</div>
            <p className="yr-b">{y.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S8 · TRACTION ────────────────────────────────────────────────────────
function Traction({ content }: { content: TractionContent }) {
  return (
    <div className="body" style={{ justifyContent: "center", gap: "3cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
      </div>
      <p
        className="serif"
        style={{
          fontSize: "clamp(2.2rem,4.8cqw,4.6rem)",
          lineHeight: 1.12,
          color: "var(--ivory)",
          maxWidth: "78%",
        }}
      >
        {content.big_statement_lead}
        <br />
        to a <span className="gold em">{(content.big_statement_accent ?? "").replace(/^to a /, "")}</span>
      </p>
      <div className="rule-full" />
      <p className="body-s" style={{ maxWidth: "58%" }}>
        {content.footnote}
      </p>
    </div>
  );
}

// ─── S9 · MARKET ──────────────────────────────────────────────────────────
function Market({ content }: { content: MarketContent }) {
  return (
    <div className="body" style={{ gap: "2.2cqh", paddingTop: "3cqh" }}>
      <div
        className="g2"
        style={{ gap: 0, alignItems: "stretch", flex: 1 }}
      >
        <div
          style={{
            paddingRight: "4cqw",
            display: "flex",
            flexDirection: "column",
            gap: "1.6cqh",
          }}
        >
          <div>
            <p className="label">{content.label}</p>
            <div className="rule" />
          </div>
          {(content.metrics ?? []).map((m, i) => (
            <div key={i}>
              <div className="mkt-v">{m.value}</div>
              <div className="mkt-l">
                {m.label} — {m.desc}
              </div>
              {i < (content.metrics ?? []).length - 1 && (
                <div className="rule-full" style={{ marginTop: "1.2rem" }} />
              )}
            </div>
          ))}
          <div className="mkt-statement" style={{ marginTop: "auto" }}>
            {content.statement?.lead}
            <br />
            {content.statement?.mid}
            <br />
            <span style={{ color: "var(--ivory)" }}>
              {content.statement?.accent}
            </span>
          </div>
        </div>

        <div
          style={{
            borderLeft: "1px solid var(--gold-line)",
            paddingLeft: "4cqw",
            display: "flex",
            flexDirection: "column",
            gap: "1.5cqh",
          }}
        >
          <div>
            <p className="label">{content.right?.label}</p>
            <div className="rule" />
            <h3
              className="serif d-sm"
              style={{ marginBottom: "1.4cqh", color: "var(--ivory)" }}
            >
              {renderMultiline(content.right?.headline)}
            </h3>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {(content.right?.moat ?? []).map((m, i) => (
              <div className="spec" key={i}>
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "1rem",
                    color: "var(--ivory)",
                    marginBottom: ".3rem",
                  }}
                >
                  {m.title}
                </div>
                <p className="body-s">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── S10 · ROADMAP ────────────────────────────────────────────────────────
function Roadmap({ content }: { content: RoadmapContent }) {
  return (
    <div className="body" style={{ gap: "2.4cqh" }}>
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" />
        <h2 className="serif d-lg" style={{ maxWidth: "80%" }}>
          {content.headline_lead}
          <br />
          <span className="gold">{content.headline_accent}</span>
        </h2>
      </div>
      <div className="g3" style={{ gap: "2.8cqw", marginBottom: ".5cqh" }}>
        {(content.phases ?? []).map((p, i) => (
          <div className="phase" key={i}>
            <div className="ph-l">{p.label}</div>
            <div className="ph-t">{p.title}</div>
            <p className="ph-b">{p.body}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "2px solid var(--gold)",
          paddingTop: "2.2cqh",
          marginTop: "2cqh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1.2rem",
          }}
        >
          <p className="label" style={{ letterSpacing: ".5em" }}>
            {content.beyond?.label}
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 200,
              fontSize: ".58rem",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--ivory-dim)",
            }}
          >
            {content.beyond?.phase}
          </p>
        </div>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 300,
            fontSize: "clamp(1rem,1.65cqw,1.55rem)",
            lineHeight: 1.72,
            color: "var(--ivory)",
            maxWidth: "88%",
          }}
        >
          {content.beyond?.body}
        </p>
      </div>
    </div>
  );
}

// ─── S11 · TEAM ───────────────────────────────────────────────────────────
function Team({ content }: { content: TeamContent }) {
  return (
    <div
      className="body"
      style={{ justifyContent: "flex-start", gap: ".8cqh", paddingTop: "3cqh" }}
    >
      <div>
        <p className="label">{content.label}</p>
        <div className="rule" style={{ marginBottom: ".8rem" }} />
      </div>
      <div className="tg">
        {(content.members ?? []).map((m, i) => (
          <div
            key={i}
            className="member"
            style={
              m.is_advisor
                ? { borderTop: "1px solid var(--gold)", paddingTop: ".9rem" }
                : undefined
            }
          >
            {m.badge ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: ".25rem",
                }}
              >
                <div className="m-n">
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noopener">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 200,
                    fontSize: ".62rem",
                    letterSpacing: ".22em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.badge}
                </span>
              </div>
            ) : (
              <div className="m-n">
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener">
                    {m.name}
                  </a>
                ) : (
                  m.name
                )}
              </div>
            )}
            <div className="m-r">{m.role}</div>
            <p className="m-b">{m.bio}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid var(--gold-line)",
          paddingTop: ".85rem",
          display: "flex",
          gap: "4cqw",
          flexShrink: 0,
          marginTop: "1cqh",
        }}
      >
        {(content.partners ?? []).map((p, i) => (
          <div key={i}>
            <p className="label" style={{ marginBottom: ".25rem" }}>
              {p.label}
            </p>
            <p className="m-b">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S12 · CLOSE ──────────────────────────────────────────────────────────
function Close({ content }: { content: CloseContent }) {
  return (
    <div
      className="body"
      style={{
        gap: 0,
        flexDirection: "row",
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "4cqh 4cqw 4cqh 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2.5cqh",
          borderRight: "1px solid var(--gold-line)",
          paddingRight: "5cqw",
        }}
      >
        <div>
          <p className="label">{content.left?.label}</p>
          <div className="rule" />
        </div>
        <p
          className="serif"
          style={{
            fontSize: "clamp(1.5rem,2.8cqw,2.8rem)",
            lineHeight: 1.2,
            color: "var(--ivory)",
          }}
        >
          {(content.left?.statement_lines ?? []).map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
          <br />
          <br />
          <span className="gold">
            {(content.left?.statement_accent_lines ?? []).map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        </p>
        <div className="rule-full" />
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {(content.left?.links ?? []).map((link, i) => {
            if (link.type === "email") {
              return (
                <a
                  key={i}
                  href={`mailto:${link.value}`}
                  className="contact-link"
                >
                  {link.value}
                </a>
              );
            }
            if (link.type === "url") {
              return (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  className="contact-link"
                  style={{
                    fontSize: ".9rem",
                    color: "var(--ivory-dim)",
                    borderColor: "var(--gold-line)",
                  }}
                >
                  {link.value}
                </a>
              );
            }
            return (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="cta"
              >
                {link.value}
              </a>
            );
          })}
        </div>
      </div>

      <div
        style={{
          width: "42%",
          flexShrink: 0,
          padding: "4cqh 0 4cqh 4cqw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2.4cqh",
        }}
      >
        <div>
          <p className="label">{content.right?.label}</p>
          <div className="rule" />
        </div>

        <div>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2.4rem,4.2cqw,4.4rem)",
              lineHeight: 1,
              color: "var(--gold)",
              fontWeight: 400,
            }}
          >
            {content.right?.amount}
          </p>
          <p
            className="label"
            style={{ marginTop: ".6rem", color: "var(--ivory-dim)" }}
          >
            {content.right?.raise_meta}
          </p>
        </div>

        <div className="rule-full" />

        <div
          style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}
        >
          {(content.right?.use_of_funds ?? []).map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "1rem",
              }}
            >
              <span className="body-s" style={{ color: "var(--ivory)" }}>
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(.9rem,1.1cqw,1.05rem)",
                  color: "var(--gold)",
                  fontStyle: "italic",
                }}
              >
                {row.pct}
              </span>
            </div>
          ))}
        </div>

        <div className="rule-full" />

        <div>
          <p className="label" style={{ marginBottom: ".5rem" }}>
            {content.right?.unlocks_label}
          </p>
          <p className="body-s" style={{ lineHeight: 1.7 }}>
            {content.right?.unlocks_body}
          </p>
        </div>

        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid var(--gold-line)",
            paddingTop: "1.2rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: "clamp(.95rem,1.2cqw,1.15rem)",
              color: "var(--gold-dim)",
              lineHeight: 1.4,
            }}
          >
            {(content.right?.footer_lines ?? []).map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
