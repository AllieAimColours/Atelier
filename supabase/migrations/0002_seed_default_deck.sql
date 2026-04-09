-- ═══════════════════════════════════════════════════════════════════════
-- THE ATELIER · 0002 · SEED DEFAULT THEME + MASTER DECK
-- ═══════════════════════════════════════════════════════════════════════
-- Inserts:
--   1. The default Aim Colours theme (gold/ivory/black, Cormorant + Jost)
--   2. The master deck (slug: 'default', no audience, status: published)
--   3. All 12 slides migrated from PitchDeck/index.html
-- ═══════════════════════════════════════════════════════════════════════

-- ─── DEFAULT THEME ────────────────────────────────────────────────────────
insert into public.themes (slug, name, tokens, is_default)
values (
  'aim-default',
  'Aim Colours · Default',
  $json${
    "colors": {
      "bg": "#090806",
      "ivory": "#f4ede1",
      "ivory_dim": "rgba(244,237,225,0.62)",
      "gold": "#c4a06a",
      "gold_dim": "rgba(196,160,106,0.72)",
      "gold_line": "rgba(196,160,106,0.28)"
    },
    "fonts": {
      "serif": "Cormorant Garamond",
      "sans": "Jost"
    }
  }$json$::jsonb,
  true
);

-- ─── MASTER DECK ──────────────────────────────────────────────────────────
insert into public.decks (slug, name, theme_id, status)
values (
  'default',
  'Aim Colours · Master Deck',
  (select id from public.themes where slug = 'aim-default'),
  'published'
);

-- ─── HELPER: deck id for inserts below ────────────────────────────────────
-- (We use a CTE approach via subquery to keep this idempotent-ish)

-- ═══════════════════════════════════════════════════════════════════════
-- SLIDES
-- ═══════════════════════════════════════════════════════════════════════

-- ─── S1 · COVER ───────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  1, 'cover', 'Aim Colours',
  $json${
    "title_top": "Aim",
    "title_bottom": "Colours",
    "patent": "Patent Pending · US 63/876,418",
    "footer_left": "The house that moves first\nowns the category.",
    "footer_right": "Dynamic electronic materials\nfor luxury accessories."
  }$json$::jsonb
);

-- ─── S2 · PROBLEM ─────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  2, 'problem', 'The Problem',
  $json${
    "label": "The Problem",
    "headline_lead": "Luxury has never found a technology",
    "headline_accent": "worthy of its standards.",
    "two_columns": [
      {
        "title": "What luxury is",
        "body": "Scarcity. Curation. Craft. An object shaped by tradition, finished by hand, defined by its impossibility to reproduce. Luxury derives its value from **what cannot be scaled.**"
      },
      {
        "title": "What technology offers",
        "body": "Uniformity. Repeatability. Mass. Every unit identical to the last — optimised for production speed, not desire. Its value comes from **what cannot be anything but uniform.**"
      }
    ],
    "transition": "Every attempt to merge the two has produced a compromise that satisfied neither — until now.",
    "pull_quote": "The client who walks into a maison today leaves with an object that will never change. The relationship ends at the door. Luxury has accepted this as inevitable.\nIt isn't."
  }$json$::jsonb
);

-- ─── S3 · VISION ──────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  3, 'vision', 'The Vision',
  $json${
    "label": "The Vision",
    "headline_lead": "The object that changes.",
    "headline_accent": "The relationship that doesn't.",
    "image": {
      "src": "/media/graphics.svg",
      "alt": "Aim Colours accessories",
      "caption": "Rendering of vision",
      "background": "#ede7db"
    },
    "three_columns": [
      {
        "title": "The Living Object",
        "body": "The Murakami monogram cycles through a Winter drop, a Summer edit, a limited colourway. The accessory has a continuing relationship with its owner — not one that ends at the point of sale."
      },
      {
        "title": "The Colour Economy",
        "body": "Produce one bag. Sell the palettes separately. A 72-hour exclusive drop. A waitlist for a collab colourway. Scarcity applied not to the object, but to the moment of colour."
      },
      {
        "title": "Client Intelligence",
        "body": "Not what they bought — what they chose to wear that morning. Every colour change is a preference signal. For the first time, a maison knows its client across a lifetime of expression."
      }
    ]
  }$json$::jsonb
);

-- ─── S4 · TECHNOLOGY ──────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  4, 'technology', 'The Technology',
  $json${
    "label": "The Technology",
    "headline_lead": "Electronics that adapt to how",
    "headline_accent": "maisons' artisans work.",
    "image": {
      "src": "/media/glove-film.svg",
      "alt": "Colour-changing film technology",
      "note": "Asset to be migrated from PitchDeck base64"
    },
    "body": "E Ink and NFC — wireless data and power transfer, no battery, no ports, no compromise to the object. Thermoformable architecture: any shape, any geometry, zero constraints for the atelier. Five years of development. E Ink partnership active.",
    "specs": [
      { "value": "1 mm", "label": "Complete profile — thinner than a credit card" },
      { "value": "Battery-free", "label": "Colour held indefinitely without power" },
      { "value": "NFC", "label": "Contact-free wireless transfer" },
      { "value": "Thermoformable", "label": "Any shape — zero atelier constraints" },
      { "value": "E Ink core", "label": "Active development partnership" }
    ],
    "patent": "Patent Pending · US 63/876,418"
  }$json$::jsonb
);

-- ─── S5 · EXPERIENCE ──────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  5, 'experience', 'The Maison Experience',
  $json${
    "label": "The Maison Experience",
    "headline_lead": "Your brand. Your palette. Your client.",
    "headline_accent": "We are invisible.",
    "numbered_columns": [
      {
        "number": "01",
        "title": "Your palette, curated",
        "body": "400 colours. The maison controls every release — which shades, to whom, for how long. A seasonal drop might offer twelve. A collab, three. The scarcity is entirely yours."
      },
      {
        "number": "02",
        "title": "Your app, your device",
        "body": "The companion app is fully white-labelled — your name, your design language. The transfer device is co-designed with your atelier. Aim Colours does not appear. The experience is entirely yours to define."
      },
      {
        "number": "03",
        "title": "Your client, remembered",
        "body": "Every colour choice, captured and returned as preference intelligence. The purchase is the beginning. The relationship never ends."
      }
    ]
  }$json$::jsonb
);

-- ─── S6 · REVENUE ─────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  6, 'revenue', 'Revenue Architecture',
  $json${
    "label": "Revenue Architecture",
    "headline_lead": "Four compounding streams.",
    "headline_accent": "One seamless integration.",
    "pillars": [
      {
        "number": "01",
        "title": "Technology",
        "body": "Colour-changing film printed to spec — any shape, any branding. Delivered as a B2B component to the maison's atelier. No visible change to the production process. Fully invisible.",
        "stat": "30% margin"
      },
      {
        "number": "02",
        "title": "App Platform",
        "body": "The companion app is fully white-labelled per partner. Seasonal palettes, limited drops, and artist colourways sold as in-app transactions — a recurring revenue channel that didn't exist before.",
        "stat": "50% handling fee"
      },
      {
        "number": "03",
        "title": "Transfer Device",
        "body": "The transfer device is co-designed with the maison's aesthetic team. Sold as part of the accessory experience or as a standalone luxury object, with exclusive seasonal drops attached.",
        "stat": "50% margin"
      },
      {
        "number": "04",
        "title": "Client Intelligence",
        "body": "Real-time colour preference data — what clients choose, when, and how often — delivered through a branded analytics platform. The most intimate client dataset a maison has ever had access to.",
        "stat": "Freemium SaaS"
      }
    ]
  }$json$::jsonb
);

-- ─── S7 · GO-TO-MARKET ────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  7, 'gtm', 'Market Entry',
  $json${
    "label": "Market Entry",
    "headline_lead": "One maison. One category.",
    "headline_accent": "Then the world follows.",
    "years": [
      {
        "label": "Year One",
        "title": "First partner",
        "body": "One maison, one category of their choosing. Proof that this technology belongs in the atelier.",
        "highlight": true
      },
      {
        "label": "Year Two",
        "title": "Expansion",
        "body": "Scale the first partner. Add two new maison contracts on proven processes."
      },
      {
        "label": "Year Three",
        "title": "Mass prestige",
        "body": "Enter the high-end mass market — Sephora, Ray-Ban, Nike. Maison-exclusive becomes category-defining."
      },
      {
        "label": "Year Four",
        "title": "Platform",
        "body": "B2B expanded. D2C launched. The data and palette layer becomes a standalone business."
      }
    ]
  }$json$::jsonb
);

-- ─── S8 · TRACTION ────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  8, 'traction', 'Validation',
  $json${
    "label": "Validation",
    "big_statement_lead": "We have sold a working prototype",
    "big_statement_accent": "to a global luxury house.",
    "footnote": "Our technology has been evaluated and acquired at the quality and precision standards required for luxury accessories — validating five years of R&D before our first commercial contract."
  }$json$::jsonb
);

-- ─── S9 · MARKET ──────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  9, 'market', 'The Opportunity',
  $json${
    "label": "The Opportunity",
    "metrics": [
      { "label": "TAM", "value": "$1.26T", "desc": "Global fashion accessories market by 2030" },
      { "label": "SAM", "value": "$434B", "desc": "Gen Z & Millennial-forward luxury accessories" },
      { "label": "SOM", "value": "$11B", "desc": "North America, Europe & Asia initial capture" }
    ],
    "statement": {
      "lead": "This is not a market we are entering.",
      "mid": "It is a category that does not yet exist.",
      "accent": "The house that names it first owns it forever."
    },
    "right": {
      "label": "Why We Win",
      "headline": "No existing colour-changing technology was built for luxury.\nOurs was built for nothing else.",
      "moat": [
        { "title": "Thermoformable architecture", "body": "No shape constraints. Any accessory geometry, any atelier standard — unchanged." },
        { "title": "Contact-free NFC transfer", "body": "No connectors, no ports, no visible hardware. Zero compromise to the design object." },
        { "title": "1 mm complete profile", "body": "Full functionality thinner than a credit card. Invisible to the eye, indistinguishable to the touch." },
        { "title": "Battery-free permanence", "body": "Holds colour indefinitely without power. As durable as the accessory itself." },
        { "title": "E Ink partnership active", "body": "Built on the world's leading electrophoretic display technology, with a live development partnership." }
      ]
    }
  }$json$::jsonb
);

-- ─── S10 · ROADMAP ────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  10, 'roadmap', 'The Road Ahead',
  $json${
    "label": "The Road Ahead",
    "headline_lead": "Five years of foundation.",
    "headline_accent": "Ready to build at maison scale.",
    "phases": [
      {
        "label": "Where We Are",
        "title": "The Foundation",
        "body": "Five years of R&D. Patent filed. Working prototypes in final development, manufacturing tests beginning with PilotFish. E Ink partnership active. A prototype already acquired by a global luxury house."
      },
      {
        "label": "What We Build Next",
        "title": "The First Contract",
        "body": "First maison partnership, full atelier integration. 400 colours curated and released on the maison's terms. Transfer device co-designed. WIPO patent filed. Team scaled as the partnership demands."
      },
      {
        "label": "Where This Goes",
        "title": "Today, colour. Tomorrow, the full canvas.",
        "body": "The next phase delivers image — monograms, prints, artist patterns on any surface. A Vuitton monogram licensed digitally: activated for a drop, withdrawn after. The image only exists when the maison permits it."
      }
    ],
    "beyond": {
      "label": "Beyond Colour",
      "phase": "Phase III · Full image capability",
      "body": "A monogram licensed digitally. Activated on any licensed surface. Withdrawn at will. For the first time, the image belongs entirely to the house — and so does every application of it. Counterfeit becomes structurally impossible. The monogram becomes a subscription. This is not a product extension. It is a new IP economy for luxury."
    }
  }$json$::jsonb
);

-- ─── S11 · TEAM ───────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  11, 'team', 'The Team',
  $json${
    "label": "The Team",
    "members": [
      {
        "name": "Alejandra Huerta, Ph.D.",
        "url": "https://www.linkedin.com/in/alejandradominguezhuerta/",
        "role": "Chief Executive Officer · Founder",
        "bio": "PhD in organic chemistry, 2021. Founded Aim Colours in 2020. Drives product vision, technology strategy, and commercial development. Five years building toward this moment."
      },
      {
        "name": "Amirreza Karimi, M.A.Sc.",
        "url": "",
        "role": "Hardware Engineering",
        "bio": "Hardware and firmware developer specialised in PCB design and wireless communications. Builds and tests the NFC and circuit architecture at the core of the technology."
      },
      {
        "name": "Jakub Pawlikowski, Dipl.-Ing.",
        "url": "",
        "role": "Hardware Engineering",
        "bio": "Dipl.-Ing. in electronics engineering. Expert in circuit miniaturisation — taking complex mixed-signal systems down to the micrometre scale. Works hands-on daily on the NFC and E Ink architecture that makes 1mm possible."
      },
      {
        "name": "Mika Rafaralahy, B.Eng.",
        "url": "",
        "role": "Software Engineering",
        "bio": "Builds the companion app and its IoT integration with the transfer device. Full-stack development across the client-facing and data layers of the platform."
      },
      {
        "name": "Hamza Salam",
        "url": "",
        "role": "Industrial Design",
        "bio": "Design, manufacturing integration, and the translation of electronics into physical luxury objects. Ensures the technology meets the aesthetic standards of the atelier."
      },
      {
        "name": "David Goubert",
        "url": "https://www.linkedin.com/in/davidgoubert/",
        "role": "Commercial Advisor",
        "badge": "15 years at LVMH",
        "bio": "Former director at Neiman Marcus. Advises on maison relationships, commercial strategy, and the cultural language of luxury at the highest level.",
        "is_advisor": true
      },
      {
        "name": "Christine Kallmayer, Ph.D.",
        "url": "https://www.linkedin.com/in/christinekallmayer/",
        "role": "Technology Advisor",
        "bio": "Doctorate in physics. 30 years in circuit miniaturisation, flexible electronics, and technology integration with fashion. A pioneering researcher in the field."
      },
      {
        "name": "Pierre N. Rolin, B.A.",
        "url": "https://www.linkedin.com/in/pierre-rolin/",
        "role": "Finance Advisor",
        "bio": "Founder of Ankh Impact Ventures. Background in private equity, international finance, and impact investing. Advises on capital structure and strategic investor relationships."
      },
      {
        "name": "Isabela Huerta, B.App.Sc.",
        "url": "https://www.linkedin.com/in/isabelahuerta/",
        "role": "Product Advisor",
        "bio": "Product management experience leading global software deployments at Microsoft and scaling enterprise products. Advises on platform architecture and growth strategy."
      }
    ],
    "partners": [
      { "label": "S2", "desc": "UI/UX & user research" },
      { "label": "PilotFish", "desc": "Design & manufacturing partner" },
      { "label": "E Ink", "desc": "Technology & development partner" }
    ]
  }$json$::jsonb
);

-- ─── S12 · CLOSE ──────────────────────────────────────────────────────────
insert into public.slides (deck_id, position, type, title, content) values (
  (select id from public.decks where slug = 'default'),
  12, 'close', 'An Invitation',
  $json${
    "left": {
      "label": "An Invitation",
      "statement_lines": [
        "Every maison has mastered",
        "the moment of purchase.",
        "No maison has ever owned",
        "what comes after."
      ],
      "statement_accent_lines": [
        "For the first time, the sale is where",
        "the relationship begins."
      ],
      "links": [
        { "type": "email", "value": "allie@aimcolours.com" },
        { "type": "url", "value": "aimcolours.com", "href": "https://aimcolours.com" },
        { "type": "cta", "value": "Watch Demo →", "href": "https://vimeo.com/1128053515?fl=ip&fe=ec" }
      ]
    },
    "right": {
      "label": "The Ask",
      "headline": "We are applying to La Maison des Startups to build the first integration alongside a maison.",
      "body": "Not to pitch a concept. To work from inside the ecosystem — alongside the ateliers, the creative directors, the clients — and prove that this technology belongs in the world's greatest luxury houses.",
      "footer_lines": [
        "The maison that moves first",
        "owns the category."
      ]
    }
  }$json$::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════════════════════════
-- Verify with:
--   select position, type, title from public.slides
--   where deck_id = (select id from public.decks where slug = 'default')
--   order by position;
