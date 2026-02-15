# Task 02 — Refinements

## Context

- **Model**: Claude Opus 4.6
- **Code**: `attempts/01/`
- **Deployed**: `fazt @local app deploy ./attempts/01 --name lens-pipeline-viz --spa`
- **URL**: https://lens-pipeline-viz.192.168.64.3.nip.io
- **Fazt knowledge base**: `~/Projects/fazt-holm/knowledge-base/skills/app/`

## What this app is

An animated 7-stage pipeline visualization for a presentation. It shows how
an AI agentic system takes fund documents, analyzes them, expands queries,
does deep research to find matching startups, extracts/enriches each one,
produces structured data, and stores it in a vector DB for semantic search.

## Architecture

- Vue 3 + Vite, deployed as a fazt app with SPA routing (`--spa`)
- BFBB routing pattern: `createWebHistory` in prod via `VITE_SPA_ROUTING`,
  `createWebHashHistory` in dev
- Routes: `/slide/00` (welcome) through `/slide/07` (vector storage)
- Slide 00 is standalone (no header/stepper), slides 01-07 render inside
  `PipelineView.vue` which provides header, progress tracker, footer stats

## File structure

```
attempts/01/
├── api/main.js                    # Serverless API (GET /api/me, POST /api/analytics/event)
├── index.html                     # Entry (loads Inter via Google Fonts)
├── package.json                   # vue, vue-router, lucide-vue-next, vite
├── vite.config.js
├── public/assets/logo.svg         # Lens logo (from frontend_02)
├── src/
│   ├── main.js                    # Vue bootstrap + router
│   ├── router.js                  # BFBB pattern routing
│   ├── app.css                    # Design system (dark default, light via :root.light)
│   ├── App.vue                    # Root: auth gate → router-view
│   ├── composables/
│   │   ├── useAuth.js             # Session check via /api/me
│   │   └── useAnalytics.js        # Event tracking
│   ├── components/
│   │   ├── PipelineView.vue       # Main shell: header, stepper, stage viewport, footer
│   │   ├── ProgressTracker.vue    # Top stepper with nodes + connectors
│   │   ├── FooterStats.vue        # Per-stage stats with animated counters
│   │   ├── AuthModal.vue          # Login gate
│   │   └── shared/TypeWriter.vue  # (unused)
│   └── slides/
│       ├── 00_Welcome.vue         # Hero landing → click to start
│       ├── 01_DataIngestion.vue   # Orbiting doc icons absorbed into core
│       ├── 02_QueryExpansion.vue  # Center + branching to query term nodes
│       ├── 03_DeepResearch.vue    # 4 parallel research agent cards
│       ├── 04_StartupExtraction.vue # Funnel → startup card grid
│       ├── 05_Enrichment.vue      # Enrichment cards with progress bars
│       ├── 06_StructuredOutput.vue # JSON schema + quality metrics
│       └── 07_VectorStorage.vue   # SVG vector space with clusters
```

## Completed refinements

1. ✅ Removed stepper numbering (was too close to navbar)
2. ✅ Stepper labels wrap to two lines when content is wide
3. ✅ Removed play/pause button from header (autoplay logic kept, just UI hidden)
4. ✅ Swapped logo to Lens logo from `~/Projects/Onesource/lens/frontend_02`
5. ✅ Confirmed Inter font is loaded and applied globally
6. ✅ Refactored stages → `src/slides/01_SlideName.vue` numbered convention
7. ✅ Added vue-router with BFBB pattern (`/slide/01` clean URLs)
8. ✅ Added welcome slide (`/slide/00`) with hero + CTA
9. ✅ Fixed Slide 02 (QueryExpansion) center alignment — circle, plus icon,
   ring, glow, and SVG branch origin are now all coincident using a
   zero-dimension anchor point with absolutely positioned children

## Remaining work

- Review & refine each slide's animations and visual polish
- User will drive specific refinement requests per slide
- Potential: mobile responsiveness (deprioritized per task 01)

## Deploy command

```bash
fazt @local app deploy ./attempts/01 --name lens-pipeline-viz --spa
```
