# Explainer Lens

Animated pipeline visualization for presentations. Holm app (Vue 3 + Vite).

## Quick reference

- **Code**: `attempts/01/`
- **Deploy**: `holm @local app deploy ./attempts/01 --name lens-pipeline-viz --spa`
- **URL**: http://lens-pipeline-viz.192.168.64.3.nip.io:8080
- **Holm knowledge base**: `~/Projects/fazt-holm/knowledge-base/skills/app/`

## Rules

- This is a **holm app** — follow patterns from the knowledge base
- BFBB routing: `createWebHistory` in prod (`VITE_SPA_ROUTING`), hash in dev
- Deploy with `--spa` flag always
- Slides live in `src/slides/XX_Name.vue` (numbered 00-07)
- Dark mode is default (`:root`), light via `:root.light`
- Desktop-first; mobile responsiveness is deprioritized
- Build: `vite build && cp -r api dist/api`
- All fetch calls to auth endpoints must include `credentials: 'include'`
- `POST /auth/logout` with JSON body `'{}'`, never GET
- **ALWAYS deploy after every change**: `holm @local app deploy ./attempts/01 --name lens-pipeline-viz --spa`

## Current tasks

See `koder/tasks/` for active work.
