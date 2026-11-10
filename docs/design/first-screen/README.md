# First screen: course homework tracker

The first screen of the product is the single page at `/`: header with course counters, the
"Next up" queue and the module grid.

| What | Where |
|---|---|
| Brief for the page (four dimensions) | `design/first-page-brief.md` |
| Brief for the "Next up" block | `design/brief.md` |
| Design source (Pencil) | `design/main-screen.pen`, frames `q4z8Y` (desktop), `c3J0N4` (mobile) |
| Frame exports | `design/frame-desktop.png`, `design/frame-mobile.png` |
| Screen before the redesign | `design/current-desktop.png`, `design/current-mobile.png` |
| Implemented screen | `desktop-1440.png`, `mobile-390.png` in this folder |
| Spec and Definition of Done | `docs/design/design-spec.md` |
| Tokens and components | `docs/design/design-system.md` |
| Live verification | `verify-ui-report.md` in this folder |
| Code | `src/App.tsx`, `src/components/tracker/`, `src/data/course.ts`, `src/index.css` |

Run it: `pnpm install`, then `pnpm dev`.
