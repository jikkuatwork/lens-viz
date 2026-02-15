# Explainer Lens

Animated pipeline visualization for presentations. Fazt app (Vue 3 + Vite).

## Quick reference

- **Code**: `attempts/01/`
- **Deploy**: `fazt @local app deploy ./attempts/01 --name lens-pipeline-viz --spa`
- **URL**: https://lens-pipeline-viz.192.168.64.3.nip.io
- **Fazt knowledge base**: `~/Projects/fazt-holm/knowledge-base/skills/app/`

## Rules

- This is a **fazt app** — follow patterns from the knowledge base
- BFBB routing: `createWebHistory` in prod (`VITE_SPA_ROUTING`), hash in dev
- Deploy with `--spa` flag always
- Slides live in `src/slides/XX_Name.vue` (numbered 00-07)
- Dark mode is default (`:root`), light via `:root.light`
- Desktop-first; mobile responsiveness is deprioritized
- Build: `vite build && cp -r api dist/api`
- All fetch calls to auth endpoints must include `credentials: 'include'`
- `POST /auth/logout` with JSON body `'{}'`, never GET

## Current tasks

See `koder/tasks/` for active work.
