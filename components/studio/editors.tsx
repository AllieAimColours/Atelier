"use client";

import type {
  CloseContent,
  CoverContent,
  ExperienceContent,
  GtmContent,
  MarketContent,
  ProblemContent,
  RevenueContent,
  RoadmapContent,
  SlideContent,
  SlideRecord,
  TeamContent,
  TechnologyContent,
  TractionContent,
  VisionContent,
} from "@/lib/types";
import { LinesField, Repeater, TextArea, TextField } from "./fields";
import MediaPicker from "./MediaPicker";

// ─── Editor router — picks the right typed editor for each slide type ──
export default function TypedEditor({
  slide,
  draft,
  onChange,
}: {
  slide: SlideRecord;
  draft: SlideContent;
  onChange: (next: SlideContent) => void;
}) {
  switch (slide.type) {
    case "cover":
      return <CoverEditor value={draft as CoverContent} onChange={onChange} />;
    case "problem":
      return <ProblemEditor value={draft as ProblemContent} onChange={onChange} />;
    case "vision":
      return <VisionEditor value={draft as VisionContent} onChange={onChange} />;
    case "technology":
      return <TechnologyEditor value={draft as TechnologyContent} onChange={onChange} />;
    case "experience":
      return <ExperienceEditor value={draft as ExperienceContent} onChange={onChange} />;
    case "revenue":
      return <RevenueEditor value={draft as RevenueContent} onChange={onChange} />;
    case "gtm":
      return <GtmEditor value={draft as GtmContent} onChange={onChange} />;
    case "traction":
      return <TractionEditor value={draft as TractionContent} onChange={onChange} />;
    case "market":
      return <MarketEditor value={draft as MarketContent} onChange={onChange} />;
    case "roadmap":
      return <RoadmapEditor value={draft as RoadmapContent} onChange={onChange} />;
    case "team":
      return <TeamEditor value={draft as TeamContent} onChange={onChange} />;
    case "close":
      return <CloseEditor value={draft as CloseContent} onChange={onChange} />;
    default:
      return <div className="studio__stub">No editor for this slide type</div>;
  }
}

// ─── S1 · COVER ──────────────────────────────────────────────────────────
function CoverEditor({
  value,
  onChange,
}: {
  value: CoverContent;
  onChange: (next: CoverContent) => void;
}) {
  return (
    <>
      <TextField
        label="Title (top)"
        value={value.title_top}
        onChange={(v) => onChange({ ...value, title_top: v })}
      />
      <TextField
        label="Title (bottom)"
        value={value.title_bottom}
        onChange={(v) => onChange({ ...value, title_bottom: v })}
      />
      <TextField
        label="Header right (patent)"
        value={value.patent}
        onChange={(v) => onChange({ ...value, patent: v })}
      />
      <TextArea
        label="Footer left"
        rows={2}
        value={value.footer_left}
        onChange={(v) => onChange({ ...value, footer_left: v })}
      />
      <TextArea
        label="Footer right"
        rows={2}
        value={value.footer_right}
        onChange={(v) => onChange({ ...value, footer_right: v })}
      />
      <TextField
        label="Demo CTA label"
        placeholder="▶ Watch the demo"
        value={value.demo_cta_label ?? ""}
        onChange={(v) => onChange({ ...value, demo_cta_label: v })}
      />
      <TextField
        label="Demo video URL (Vimeo or YouTube embed)"
        placeholder="https://player.vimeo.com/video/..."
        value={value.demo_video_url ?? ""}
        onChange={(v) => onChange({ ...value, demo_video_url: v })}
      />
    </>
  );
}

// ─── S2 · PROBLEM ────────────────────────────────────────────────────────
function ProblemEditor({
  value,
  onChange,
}: {
  value: ProblemContent;
  onChange: (next: ProblemContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <Repeater
        label="Two columns"
        items={value.two_columns}
        newItem={() => ({ title: "", body: "" })}
        itemTitle={(item, i) => item.title || `Column ${i + 1}`}
        onChange={(next) => onChange({ ...value, two_columns: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={4}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
          </>
        )}
      />
      <TextArea
        label="Transition line"
        rows={2}
        value={value.transition}
        onChange={(v) => onChange({ ...value, transition: v })}
      />
      <TextArea
        label="Pull quote"
        rows={4}
        value={value.pull_quote}
        onChange={(v) => onChange({ ...value, pull_quote: v })}
      />
    </>
  );
}

// ─── S3 · VISION ─────────────────────────────────────────────────────────
function VisionEditor({
  value,
  onChange,
}: {
  value: VisionContent;
  onChange: (next: VisionContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <MediaPicker
        label="Vision image"
        value={value.image.src}
        alt={value.image.alt}
        onChange={(url) =>
          onChange({ ...value, image: { ...value.image, src: url } })
        }
      />
      <TextField
        label="Image alt text"
        value={value.image.alt}
        onChange={(v) =>
          onChange({ ...value, image: { ...value.image, alt: v } })
        }
      />
      <TextField
        label="Image caption"
        value={value.image.caption}
        onChange={(v) =>
          onChange({ ...value, image: { ...value.image, caption: v } })
        }
      />
      <TextField
        label="Image background colour"
        value={value.image.background}
        onChange={(v) =>
          onChange({ ...value, image: { ...value.image, background: v } })
        }
      />
      <Repeater
        label="Three columns"
        items={value.three_columns}
        newItem={() => ({ title: "", body: "" })}
        itemTitle={(item, i) => item.title || `Column ${i + 1}`}
        onChange={(next) => onChange({ ...value, three_columns: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={4}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
          </>
        )}
      />
    </>
  );
}

// ─── S4 · TECHNOLOGY ─────────────────────────────────────────────────────
function TechnologyEditor({
  value,
  onChange,
}: {
  value: TechnologyContent;
  onChange: (next: TechnologyContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <TextArea
        label="Body paragraph"
        rows={4}
        value={value.body}
        onChange={(v) => onChange({ ...value, body: v })}
      />
      <Repeater
        label="Specs"
        items={value.specs}
        newItem={() => ({ value: "", label: "" })}
        itemTitle={(item, i) => item.value || `Spec ${i + 1}`}
        onChange={(next) => onChange({ ...value, specs: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Value (e.g. 1mm)"
              value={item.value}
              onChange={(v) => update({ ...item, value: v })}
            />
            <TextField
              label="Description"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
          </>
        )}
      />
      <TextField
        label="Patent badge"
        value={value.patent}
        onChange={(v) => onChange({ ...value, patent: v })}
      />
    </>
  );
}

// ─── S5 · EXPERIENCE ─────────────────────────────────────────────────────
function ExperienceEditor({
  value,
  onChange,
}: {
  value: ExperienceContent;
  onChange: (next: ExperienceContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <Repeater
        label="Numbered columns"
        items={value.numbered_columns}
        newItem={() => ({ number: "01", title: "", body: "" })}
        itemTitle={(item, i) => `${item.number || i + 1} · ${item.title || ""}`}
        onChange={(next) => onChange({ ...value, numbered_columns: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Number"
              value={item.number}
              onChange={(v) => update({ ...item, number: v })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={4}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
          </>
        )}
      />
    </>
  );
}

// ─── S6 · REVENUE ────────────────────────────────────────────────────────
function RevenueEditor({
  value,
  onChange,
}: {
  value: RevenueContent;
  onChange: (next: RevenueContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <Repeater
        label="Pillars"
        items={value.pillars}
        newItem={() => ({ number: "01", title: "", body: "", stat: "" })}
        itemTitle={(item, i) => `${item.number || i + 1} · ${item.title || ""}`}
        onChange={(next) => onChange({ ...value, pillars: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Number"
              value={item.number}
              onChange={(v) => update({ ...item, number: v })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={4}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
            <TextField
              label="Stat (e.g. 30% margin)"
              value={item.stat}
              onChange={(v) => update({ ...item, stat: v })}
            />
          </>
        )}
      />
    </>
  );
}

// ─── S7 · GTM ────────────────────────────────────────────────────────────
function GtmEditor({
  value,
  onChange,
}: {
  value: GtmContent;
  onChange: (next: GtmContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <Repeater
        label="Years"
        items={value.years}
        newItem={() => ({
          label: "Year One",
          title: "",
          body: "",
          highlight: false,
        })}
        itemTitle={(item) => item.label || "Year"}
        onChange={(next) => onChange({ ...value, years: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Year label"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={3}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
            <label
              className="studio__field-label"
              style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
            >
              <input
                type="checkbox"
                checked={item.highlight ?? false}
                onChange={(e) => update({ ...item, highlight: e.target.checked })}
              />
              Highlight (gold border)
            </label>
          </>
        )}
      />
    </>
  );
}

// ─── S8 · TRACTION ───────────────────────────────────────────────────────
function TractionEditor({
  value,
  onChange,
}: {
  value: TractionContent;
  onChange: (next: TractionContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Big statement (lead)"
        value={value.big_statement_lead}
        onChange={(v) => onChange({ ...value, big_statement_lead: v })}
      />
      <TextField
        label="Big statement (gold accent)"
        value={value.big_statement_accent}
        onChange={(v) => onChange({ ...value, big_statement_accent: v })}
      />
      <TextArea
        label="Footnote"
        rows={4}
        value={value.footnote}
        onChange={(v) => onChange({ ...value, footnote: v })}
      />
    </>
  );
}

// ─── S9 · MARKET ─────────────────────────────────────────────────────────
function MarketEditor({
  value,
  onChange,
}: {
  value: MarketContent;
  onChange: (next: MarketContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <Repeater
        label="Metrics (TAM/SAM/SOM)"
        items={value.metrics}
        newItem={() => ({ label: "", value: "", desc: "" })}
        itemTitle={(item) => `${item.label || "?"} · ${item.value || ""}`}
        onChange={(next) => onChange({ ...value, metrics: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Label (TAM, SAM, SOM)"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
            <TextField
              label="Value (e.g. $1.26T)"
              value={item.value}
              onChange={(v) => update({ ...item, value: v })}
            />
            <TextField
              label="Description"
              value={item.desc}
              onChange={(v) => update({ ...item, desc: v })}
            />
          </>
        )}
      />
      <TextField
        label="Statement lead"
        value={value.statement.lead}
        onChange={(v) =>
          onChange({ ...value, statement: { ...value.statement, lead: v } })
        }
      />
      <TextField
        label="Statement mid"
        value={value.statement.mid}
        onChange={(v) =>
          onChange({ ...value, statement: { ...value.statement, mid: v } })
        }
      />
      <TextField
        label="Statement accent (ivory line)"
        value={value.statement.accent}
        onChange={(v) =>
          onChange({ ...value, statement: { ...value.statement, accent: v } })
        }
      />
      <TextField
        label="Right column label"
        value={value.right.label}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, label: v } })
        }
      />
      <TextArea
        label="Right column headline"
        rows={3}
        value={value.right.headline}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, headline: v } })
        }
      />
      <Repeater
        label="Moat (right column)"
        items={value.right.moat}
        newItem={() => ({ title: "", body: "" })}
        itemTitle={(item, i) => item.title || `Moat ${i + 1}`}
        onChange={(next) =>
          onChange({ ...value, right: { ...value.right, moat: next } })
        }
        renderItem={(item, update) => (
          <>
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={3}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
          </>
        )}
      />
    </>
  );
}

// ─── S10 · ROADMAP ───────────────────────────────────────────────────────
function RoadmapEditor({
  value,
  onChange,
}: {
  value: RoadmapContent;
  onChange: (next: RoadmapContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <TextField
        label="Headline (lead)"
        value={value.headline_lead}
        onChange={(v) => onChange({ ...value, headline_lead: v })}
      />
      <TextField
        label="Headline (gold accent)"
        value={value.headline_accent}
        onChange={(v) => onChange({ ...value, headline_accent: v })}
      />
      <Repeater
        label="Phases"
        items={value.phases}
        newItem={() => ({ label: "", title: "", body: "" })}
        itemTitle={(item, i) => item.title || `Phase ${i + 1}`}
        onChange={(next) => onChange({ ...value, phases: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Phase label"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update({ ...item, title: v })}
            />
            <TextArea
              label="Body"
              rows={4}
              value={item.body}
              onChange={(v) => update({ ...item, body: v })}
            />
          </>
        )}
      />
      <TextField
        label="Beyond label"
        value={value.beyond.label}
        onChange={(v) =>
          onChange({ ...value, beyond: { ...value.beyond, label: v } })
        }
      />
      <TextField
        label="Beyond phase header"
        value={value.beyond.phase}
        onChange={(v) =>
          onChange({ ...value, beyond: { ...value.beyond, phase: v } })
        }
      />
      <TextArea
        label="Beyond body"
        rows={6}
        value={value.beyond.body}
        onChange={(v) =>
          onChange({ ...value, beyond: { ...value.beyond, body: v } })
        }
      />
    </>
  );
}

// ─── S11 · TEAM ──────────────────────────────────────────────────────────
function TeamEditor({
  value,
  onChange,
}: {
  value: TeamContent;
  onChange: (next: TeamContent) => void;
}) {
  return (
    <>
      <TextField
        label="Section label"
        value={value.label}
        onChange={(v) => onChange({ ...value, label: v })}
      />
      <Repeater
        label="Team members"
        items={value.members}
        newItem={() => ({
          name: "",
          url: "",
          role: "",
          bio: "",
          badge: undefined as string | undefined,
          is_advisor: false as boolean | undefined,
        })}
        itemTitle={(item) => item.name || "New member"}
        onChange={(next) => onChange({ ...value, members: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Name"
              value={item.name}
              onChange={(v) => update({ ...item, name: v })}
            />
            <TextField
              label="Role"
              value={item.role}
              onChange={(v) => update({ ...item, role: v })}
            />
            <TextField
              label="LinkedIn URL (optional)"
              value={item.url}
              onChange={(v) => update({ ...item, url: v })}
            />
            <TextArea
              label="Bio"
              rows={4}
              value={item.bio}
              onChange={(v) => update({ ...item, bio: v })}
            />
            <TextField
              label="Badge (optional, e.g. '15 years at LVMH')"
              value={item.badge ?? ""}
              onChange={(v) => update({ ...item, badge: v })}
            />
            <label
              className="studio__field-label"
              style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
            >
              <input
                type="checkbox"
                checked={item.is_advisor ?? false}
                onChange={(e) =>
                  update({ ...item, is_advisor: e.target.checked })
                }
              />
              Advisor (gold separator above)
            </label>
          </>
        )}
      />
      <Repeater
        label="Partners (footer)"
        items={value.partners}
        newItem={() => ({ label: "", desc: "" })}
        itemTitle={(item) => item.label || "Partner"}
        onChange={(next) => onChange({ ...value, partners: next })}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Label"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
            <TextField
              label="Description"
              value={item.desc}
              onChange={(v) => update({ ...item, desc: v })}
            />
          </>
        )}
      />
    </>
  );
}

// ─── S12 · CLOSE ─────────────────────────────────────────────────────────
function CloseEditor({
  value,
  onChange,
}: {
  value: CloseContent;
  onChange: (next: CloseContent) => void;
}) {
  return (
    <>
      <div className="studio__field-label" style={{ marginTop: ".4rem" }}>
        Left side · An Invitation
      </div>
      <TextField
        label="Label"
        value={value.left.label}
        onChange={(v) => onChange({ ...value, left: { ...value.left, label: v } })}
      />
      <LinesField
        label="Statement lines (one per line)"
        value={value.left.statement_lines}
        onChange={(v) =>
          onChange({ ...value, left: { ...value.left, statement_lines: v } })
        }
      />
      <LinesField
        label="Statement accent lines (gold, one per line)"
        value={value.left.statement_accent_lines}
        onChange={(v) =>
          onChange({
            ...value,
            left: { ...value.left, statement_accent_lines: v },
          })
        }
      />
      <Repeater
        label="Links (email / url / cta)"
        items={value.left.links}
        newItem={() => ({
          type: "url" as "email" | "url" | "cta",
          value: "",
          href: "",
        })}
        itemTitle={(item) => `${item.type} · ${item.value || ""}`}
        onChange={(next) =>
          onChange({ ...value, left: { ...value.left, links: next } })
        }
        renderItem={(item, update) => (
          <>
            <div className="studio__field">
              <label className="studio__field-label">Type</label>
              <select
                className="studio__input"
                value={item.type}
                onChange={(e) =>
                  update({
                    ...item,
                    type: e.target.value as "email" | "url" | "cta",
                  })
                }
              >
                <option value="email">email</option>
                <option value="url">url</option>
                <option value="cta">cta</option>
              </select>
            </div>
            <TextField
              label="Display value"
              value={item.value}
              onChange={(v) => update({ ...item, value: v })}
            />
            {item.type !== "email" && (
              <TextField
                label="href"
                value={item.href ?? ""}
                onChange={(v) => update({ ...item, href: v })}
              />
            )}
          </>
        )}
      />

      <div className="studio__field-label" style={{ marginTop: "1.4rem" }}>
        Right side · The Ask
      </div>
      <TextField
        label="Label"
        value={value.right.label}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, label: v } })
        }
      />
      <TextField
        label="Amount (e.g. $1.3M)"
        value={value.right.amount}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, amount: v } })
        }
      />
      <TextField
        label="Raise meta (e.g. Pre-Seed · 18-month runway)"
        value={value.right.raise_meta}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, raise_meta: v } })
        }
      />
      <Repeater
        label="Use of funds"
        items={value.right.use_of_funds}
        newItem={() => ({ label: "", pct: "" })}
        itemTitle={(item) => `${item.label || "?"} · ${item.pct || ""}`}
        onChange={(next) =>
          onChange({ ...value, right: { ...value.right, use_of_funds: next } })
        }
        renderItem={(item, update) => (
          <>
            <TextField
              label="Category"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
            />
            <TextField
              label="Percentage (e.g. 35%)"
              value={item.pct}
              onChange={(v) => update({ ...item, pct: v })}
            />
          </>
        )}
      />
      <TextField
        label="Unlocks label (e.g. What this unlocks)"
        value={value.right.unlocks_label}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, unlocks_label: v } })
        }
      />
      <TextArea
        label="Unlocks body (milestones)"
        rows={3}
        value={value.right.unlocks_body}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, unlocks_body: v } })
        }
      />
      <LinesField
        label="Footer lines (italic, one per line)"
        value={value.right.footer_lines}
        onChange={(v) =>
          onChange({ ...value, right: { ...value.right, footer_lines: v } })
        }
      />
    </>
  );
}
