# The Atelier

The workshop where the maison's pitch is built.

AI-powered, personalized investor experience platform for [Aim Colours](https://aimcolours.com).

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with luxury brand tokens
- **Supabase** (Postgres + Auth + Storage)
- **Anthropic Claude API** (AI co-pilot)
- **Vercel** hosting

## Local development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

Open http://localhost:3000

## Roadmap

- **Phase 1 — Foundation:** Repo, schema, deck migration, public renderer ← *we are here*
- **Phase 2 — Studio:** Visual editor, media library, save/publish
- **Phase 3 — AI co-pilot:** Chat with Claude inside the editor
- **Phase 4 — Variants:** Personalized decks per audience (Chanel, Sequoia, etc.)
- **Phase 5 — Financial model:** Excel upload, live charts, interactive sliders
- **Phase 6 — Investor portal:** /pitch/[audience] with embedded deck + model
- **Phase 7 — Telemetry:** Per-audience engagement dashboard

## Surfaces

- `/` — public landing (this page)
- `/pitch/[audience]` — personalized investor deck (coming Phase 6)
- `/studio` — private editor + AI co-pilot (coming Phase 2)
