# verify-ui report: "Next up" queue

- Date: 2026-11-10
- Target: http://localhost:5183/ (dev server), code at commit `2bcc1fd`; BR-11 re-run after the `--ring` token fix
- Criteria: requirements BR-01 – BR-12 and checks DOD-01 – DOD-10 from `docs/design/design-spec.md`.
  There is no PRD for this block, so the spec is the only source of criteria.
- Tool: a live Chromium browser driven by an agent (real clicks and key presses, DOM and
  computed styles read from the page). `playwright-cli`, the default tool of the skill, is not
  installed on this machine, so the run used a different live browser. Viewports were emulated
  at 1440x1000 and 390x844.
- Screenshots: `desktop-1440.png`, `mobile-390.png` in this folder (default state, taken with
  headless Edge). The submitted and cleared states have no screenshots; their evidence is the
  values read from the page, listed below.

## Verdict per requirement

| ID | Verdict | Expected | Actual (read from the page) |
|---|---|---|---|
| BR-01 | PASS | first open item is the strongest row, labelled "Hand in next" | row 1 only: label present, background `oklch(0.9461 0 0)` (`--muted`), left border `3px oklch(0.54 0.115 160.908)` (`--primary`), title 22px Newsreader; row 2: transparent background, title 16px Geist. After marking item 1 the label and the background move to row 2 |
| BR-02 | PASS | destination is a tag next to the title, no separate sentence | tags read "Hand in on Platform" x3 and "Hand in on Telegram" (the words "Hand in on" are screen-reader only); no "Hand in on the platform" / "Send in Telegram" paragraph in any row |
| BR-03 | PASS | "Mark as submitted" crosses the item out, shows "Submitted" and "Undo" | after a real click on row 1: row text "1 5.8 Design with Claude Submitted Undo", title `text-decoration-line: line-through`, the only button in the row is "Undo" |
| BR-04 | PASS | "Undo" restores the item, also from the cleared state | after a real click on "Undo": counter "4 to hand in", 0 "Undo" buttons, "Hand in next" on row 1 again. From the cleared state: "Undo" on row 4 gives "1 to hand in", cleared view gone, "Hand in next" on row 4 |
| BR-05 | PASS | counter "N to hand in" / "Queue cleared", follows every press | 4 → 3 → 4 → "Queue cleared" → "1 to hand in"; the element has `aria-live="polite"` |
| BR-06 | PASS | cleared view names the next module | "Queue cleared. Every released hand-in is submitted. Nothing is due until the next module opens. Opens next Module 7 · First feature 11 Nov"; 0 "Mark as submitted" buttons, 4 "Undo" buttons |
| BR-07 | PASS | only the installed `Button` and `Card` | `src/components/ui` contains `button.tsx`, `card.tsx`; the queue imports exactly these two |
| BR-08 | PASS | no raw color values in components | 0 matches for `#hex`, `rgb(`, `oklch(`, `hsl(` in `src/**/*.ts(x)`; computed button colors equal the token values |
| BR-09 | PASS | typed data from `course.ts` | `tsc -p tsconfig.app.json --noEmit` exit 0; props `items: QueueItem[]`, `opensNext` from `nextOpening(modules)` |
| BR-10 | PASS | 1440: queue left of modules; 390: queue above modules; no horizontal scroll | 1440: queue x 112–599, modules x 647–1328, `scrollWidth` 1440 = `clientWidth` 1440. 390: queue y 487–1166, modules start at 1206, `scrollWidth` 390 = `clientWidth` 390 in default and cleared states; every button and tag is inside the viewport |
| BR-11 | PASS (after fix) | named buttons, keyboard operable, visible focus ring, hidden decorative icons | Tab lands on "Mark as submitted" with `:focus-visible`, Enter changes the counter to "3 to hand in", all 4 `svg` are `aria-hidden`. First run: FAIL, the 3px ring used `--ring` `oklch(0.8348 0.1302 160.908)` at 50% opacity, roughly 1.2:1 against the page, under the 3:1 expected for a focus indicator. After changing light `--ring` to `oklch(0.22 0.04 160.9080)` the same ring measures 3.24:1 against the emphasized row and 3.32:1 against the plain card (computed from the rendered colors) |
| BR-12 | PASS | header and module grid unchanged, no new dependency | `git diff --stat 2b7d773 2bcc1fd -- src package.json pnpm-lock.yaml`: only `src/App.tsx` (4 lines), `next-up-queue.tsx`, `src/data/course.ts` (5 lines) |

Summary: PASS (12 of 12) after one fix. The first run was FAIL (11 of 12) on focus ring contrast; the token was fixed in a separate step and BR-11 was run again.

## Definition of Done rows

| ID | Verdict | Evidence |
|---|---|---|
| DOD-01 | PASS | `design-spec.md` sections 1–14 |
| DOD-02 | PASS | `design/main-screen.pen`, `design/frame-desktop.png`, `design/frame-mobile.png` |
| DOD-03 | PASS | 0 raw color matches; `src/components/ui`: `button.tsx`, `card.tsx` |
| DOD-04 | PASS | Ready, Success and Empty reached in the browser |
| DOD-05 | PASS | counter sequence above |
| DOD-06 | PASS | positions and `scrollWidth` above; `desktop-1440.png`, `mobile-390.png` |
| DOD-07 | PASS (after fix) | see BR-11: ring contrast 3.24:1 and 3.32:1 |
| DOD-08 | PASS | `tsc` exit 0, `pnpm lint` exit 0, `pnpm build` "built in 228ms" |
| DOD-09 | PASS | diff stat above: 3 files, +122 / −54 |
| DOD-10 | PASS | this report |

## Findings outside the written criteria

These are not covered by a requirement in the spec, so they have no verdict; they are recorded
for the next change.

1. **Keyboard focus is lost after activation.** After Enter on "Mark as submitted" the focused
   button is removed with its row and `document.activeElement` becomes `body`. The next Tab does
   continue from the same place (it lands on "Undo" in that row), but a screen-reader user gets
   no focused element in between.
2. **Mobile "Opens next" chip is two lines** (60px high): the date wraps under the module name.
   Listed as an open decision in the spec.
3. **Mobile title wraps:** "5.8 Design with Claude" takes two lines next to the tag at 390px.
   This matches the approved mobile frame.
4. **State is not persisted:** after a reload the counter is "4 to hand in" again. This is a
   stated non-goal.

## Handoff

The focus ring failure came from the token `--ring`, which still held the pale mint of the original
theme. It was fixed as a separate step by one token change in `src/index.css` (light theme only),
then BR-11 was verified again. `pnpm exec tsc -p tsconfig.app.json --noEmit`, `pnpm lint` and
`pnpm build` pass after the change. Finding 1 above (focus lost after activation) is still open.
