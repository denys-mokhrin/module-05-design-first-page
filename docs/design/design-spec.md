---
feature: next-up-queue
status: Verified (12 of 12 requirements pass after the focus ring fix)
owner: Denys Mokhrin (product owner and developer)
updated_at: 2026-11-10
---

# Design spec: "Next up" queue of the course homework tracker

> Note on timing. This spec was written after the block had been designed in Pencil and
> implemented (commit `2bcc1fd`). It records the contract the work followed and is the input for
> the live `verify-ui` run. Statements are marked Confirmed (my decision or `design/brief.md`),
> Observed (repository evidence) or Proposed (still needs my approval).

## 1. Raw request

> I should see the next thing to submit and where it goes at a glance, without reading three
> lines of text per item, and a finished queue should look finished, not like an empty list.

Source: `design/brief.md`, section Goal.

## 2. Why now

- **Problem:** every queue item took three lines of text (title, what to hand in, where), and a
  fully submitted queue looked the same as a list of crossed-out rows.
- **User:** me, a student of "Agentic Engineering 3.0", opening the tracker in the evening.
- **Trigger:** module 5 lesson on design tools; the block is the part of the page I act on.
- **Success outcome:** the first open item and its destination are readable without scanning the
  list, and a cleared queue says so and names what opens next.

## 3. Evidence sources

| Status | Source | What it proves |
|---|---|---|
| Confirmed | `design/brief.md` | goal, behavior to keep, states, layouts 1440 and 390 |
| Confirmed | `design/main-screen.pen`, frames `q4z8Y` (desktop), `c3J0N4` (mobile) | the approved design; I approved the frames before implementation |
| Observed | `src/App.tsx` | single page, no router; the queue is the left column of a two-column grid from the `lg` breakpoint |
| Observed | `src/components/tracker/next-up-queue.tsx` | owner of the block; local state in a `Set`, counter with `aria-live="polite"` |
| Observed | `src/data/course.ts` | typed data: `QueueItem`, `Destination = "platform" \| "telegram"`, `nextOpening(modules)` |
| Observed | `src/components/ui/button.tsx`, `src/components/ui/card.tsx` | the only installed UI primitives; Button variants default, outline, ghost, sizes sm, default, lg |
| Observed | `src/index.css` | tokens in `:root` and `.dark`; `.figures` (tabular numbers), `prefers-reduced-motion` rule |
| Observed | `package.json` | checks that exist: `tsc -p tsconfig.app.json --noEmit`, `pnpm lint`, `pnpm build`; there are no tests |
| Proposed | cleared state keeps submitted rows | deviation from frame `XoPp4`, see section 14 |

## 4. Current user flow (before the change, commit `2b7d773`)

1. **Start:** four items, each with title, hand-in line and a "Hand in on the platform" line; the
   first one has a larger title and a solid button.
2. **Action:** "Mark as submitted".
3. **System response:** the row is crossed out, shows "Submitted" and a ghost "Undo"; the counter
   changes from "4 to hand in" to "3 to hand in".
4. **Success:** with all items submitted the counter says "Queue cleared"; the card still shows
   four crossed-out rows.
5. **Recovery:** "Undo" returns the item. Nothing is persisted, a reload resets the queue.

## 5. Target user flow

1. **Start:** four items; the first open one is marked "Hand in next" with a tinted background
   and a primary bar; the destination is a tag next to the title.
2. **Action:** "Mark as submitted" on any open item.
3. **System response:** the row collapses to a quiet crossed-out line with "Submitted" and
   "Undo"; the next open item becomes "Hand in next"; the counter follows.
4. **Success:** with all items submitted the block shows "Queue cleared" and what opens next.
5. **Recovery:** "Undo" on any submitted row returns it, also from the cleared state.

## 6. Requirements

| ID | Status | Requirement | Source |
|---|---|---|---|
| BR-01 | Confirmed | The first item that is not submitted is the visually strongest row and is labelled "Hand in next". | brief, Keep; frame `q4z8Y` |
| BR-02 | Confirmed | Each open row shows its destination as a tag ("Platform" or "Telegram") next to the title, not as a separate sentence. | brief, Goal; frame `q4z8Y` |
| BR-03 | Confirmed | "Mark as submitted" crosses the item out and shows "Submitted" with an "Undo" button. | brief, Keep |
| BR-04 | Confirmed | "Undo" brings the item back as an open row, including from the cleared state. | brief, Keep |
| BR-05 | Confirmed | The block counter reads "N to hand in" for N open items and "Queue cleared" for none, and changes with every button press. | brief, Keep; `next-up-queue.tsx` |
| BR-06 | Confirmed | With no open items the block shows a "Queue cleared" view that names the next module to open. | brief, States; frame `XoPp4` |
| BR-07 | Confirmed | The block is built from the installed `Button` and `Card`; no new UI primitive or library is added. | brief, Keep |
| BR-08 | Confirmed | Every color comes from a token in `src/index.css`; no raw color value in component markup. | brief, Keep |
| BR-09 | Confirmed | Data enters the block as typed props from `src/data/course.ts`; destination is the union `"platform" \| "telegram"`. | brief, Keep |
| BR-10 | Confirmed | At 1440px the queue is the left column; at 390px the page is one column with the queue before the modules; no horizontal scrolling at either width. | brief, Layouts; frames `q4z8Y`, `c3J0N4` |
| BR-11 | Observed | Buttons have text names, are reachable and operable by keyboard with a visible focus ring; decorative icons are hidden from assistive technology; the tag reads "Hand in on Platform". | `next-up-queue.tsx`, `button.tsx` |
| BR-12 | Confirmed | The page header and the module grid do not change; no route, dependency or data shape outside the queue changes. | implementation prompt, `design/prompts/04-implement.md` |

## 7. Routes and frames

| Surface | Route / frame | Required content and layout |
|---|---|---|
| Current | `/` (single page, dev URL http://localhost:5183/) | header, "Next up" queue, module grid |
| Desktop | 1440 wide, frame "Next up / desktop" `q4z8Y` | queue in the left column (5 of 12 parts), modules on the right |
| Mobile | 390 wide, frame "Next up / mobile" `c3J0N4` | one column: header, queue, modules |
| States | `h80BKq`, `XoPp4`, `fJsLM`, `NIF9p` | one item submitted; queue cleared; both widths |

## 8. State inventory

| State | Trigger | Visible result | Recovery / next action |
|---|---|---|---|
| Empty | all items submitted | "Queue cleared" view, "Opens next" with module 7, counter "Queue cleared" | "Undo" on a submitted row |
| Loading | N/A — data is a local typed file | — | — |
| Ready | page load | four open rows, first one "Hand in next", counter "4 to hand in" | "Mark as submitted" |
| Success | "Mark as submitted" | row crossed out, "Submitted", "Undo"; next open row takes the emphasis | "Undo" |
| Error | N/A — no network or persistence | — | — |
| Disabled / focus / hover | keyboard Tab, pointer hover | focus ring and hover style of the existing `Button`; no disabled controls | Enter or Space activates |

## 9. Reuse and handoff contract

| Design responsibility | Current code owner / token | Decision |
|---|---|---|
| Block, rows, counter, state | `src/components/tracker/next-up-queue.tsx` | extend in place |
| Buttons "Mark as submitted", "Undo" | `Button` (default, outline, size sm) | reuse |
| Card surface | `Card` | reuse |
| Destination tag | local `DestinationTag` in the block, `lucide-react` icons already installed | new local component, not a UI primitive |
| Cleared view | local `QueueCleared` in the block | new local component |
| "Opens next" data | `nextOpening(modules)` in `src/data/course.ts`, prop `opensNext` | new typed helper |
| Colors | `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--card` | reuse, nothing added |
| Numbers | `.figures` in `src/index.css` | reuse |

## 10. Responsive and accessibility contract

- **Responsive:** one column below the `lg` breakpoint with the queue first; long titles wrap
  next to the tag; every button stays reachable; no horizontal scrolling at 390px.
- **Keyboard:** Tab order follows the list order; Enter and Space activate buttons; focus ring
  of the existing `Button` stays visible.
- **Semantics:** block heading is `h2` "Next up" labelling the section; items are an ordered
  list; the counter is a polite live region; icons are `aria-hidden`.
- **Contrast and motion:** text uses foreground tokens on background tokens; the block adds no
  motion.

## 11. Content and realistic data

- Counter: "4 to hand in", "3 to hand in", "Queue cleared".
- Row label: "Hand in next". Buttons: "Mark as submitted", "Undo". Status: "Submitted".
- Tags: "Platform", "Telegram".
- Items: "5.8 Design with Claude", "5.9 Figma / Pencil", "Module 5 checklist",
  "Capstone: plugin for my own SaaS".
- Cleared view: "Queue cleared", "Every released hand-in is submitted. Nothing is due until the
  next module opens.", "Opens next", "Module 7 · First feature", "11 Nov".

## 12. Non-goals and forbidden changes

- No persistence: marking does not survive a reload and does not change header or module counters.
- No change to the page header, the module grid, tokens, or installed UI components.
- No new dependency, route or UI library.

## 13. Design references

- Current UI evidence: `design/current-desktop.png`, `design/current-mobile.png`.
- Approved frames: "Next up / desktop" `q4z8Y`, "Next up / mobile" `c3J0N4`; exports
  `design/frame-desktop.png`, `design/frame-mobile.png`.
- Repo-local design file: `design/main-screen.pen`.

## 14. Open decisions

| Decision | Why it matters | Owner | Due | Status |
|---|---|---|---|---|
| In the cleared state the submitted rows with "Undo" stay under the "Queue cleared" view; the approved frame `XoPp4` shows only the view. | Hiding the rows matches the frame but removes "Undo" for the last item (BR-04). | Denys | before the next change of this block | Proposed |
| Wording of the cleared-view sentence. | It was written during design, not in the brief. | Denys | same | Proposed |
| On mobile the "Opens next" chip wraps its date to a second line. | Differs from the frame; purely visual. | Denys | same | Proposed |

## 15. Spec-ready gate

- [x] Current product behavior is backed by repository evidence.
- [x] Product decisions are confirmed or visibly marked Proposed.
- [x] Requirements have stable IDs.
- [x] Desktop/mobile, states, reuse, accessibility, and non-goals are covered.
- [x] No route, dependency, component, token, or API has been invented as fact.
- [x] Every requirement maps to a DOD row in section 16 below.

---

# Definition of Done

Completion means every applicable row is checked with evidence. An agent report, generated image,
or visual impression is not evidence by itself.

## 16. Done checks

| ID | Covers | Layer | Pass condition | Evidence | Done |
|---|---|---|---|---|---|
| DOD-01 | BR-12 | Specification | Scope, sources and non-goals are explicit. | Sections 1–14 of this file | [x] |
| DOD-02 | BR-01, BR-02, BR-06 | Design structure | Frames `q4z8Y` and `c3J0N4` exist; the queue in them is built from component instances. | `design/main-screen.pen`, `design/frame-desktop.png`, `design/frame-mobile.png` | [x] |
| DOD-03 | BR-07, BR-08 | Tokens and reuse | No raw color value in `src/**/*.tsx`; `src/components/ui` contains only `button.tsx` and `card.tsx`. | search for `#hex`, `rgb(`, `oklch(` in `src` components; directory listing | [x] |
| DOD-04 | BR-03, BR-06 | States | Ready, Success and Empty are reachable in the browser; Loading and Error are N/A. | browser actions on http://localhost:5183/ | [x] |
| DOD-05 | BR-01, BR-03, BR-04, BR-05 | Behavior | Counter goes 4 → 3 after one mark, "Hand in next" moves to item 2, "Undo" restores 4; after four marks the counter says "Queue cleared"; "Undo" from the cleared state gives "1 to hand in". | live browser scenario | [x] |
| DOD-06 | BR-02, BR-10 | Responsive | At 1440 the queue is left of the modules; at 390 it is above them; `scrollWidth` equals `clientWidth` at both widths; all buttons visible. | viewport screenshots + DOM check | [x] |
| DOD-07 | BR-11 | Accessibility | Every button has a text name; Tab reaches the first "Mark as submitted" and shows a focus ring; the counter has `aria-live="polite"`; icons are `aria-hidden`. | keyboard run + DOM inspection | [x] |
| DOD-08 | BR-09 | Deterministic gates | `pnpm exec tsc -p tsconfig.app.json --noEmit`, `pnpm lint` and `pnpm build` pass. | command output | [x] |
| DOD-09 | BR-12 | Scope | The change touches only `next-up-queue.tsx`, `course.ts`, `App.tsx` under `src`; no change in `package.json`. | `git diff --stat 2b7d773 2bcc1fd -- src package.json` | [x] |
| DOD-10 | BR-01 – BR-12 | Live evidence | Each requirement has a PASS / FAIL verdict with expected vs actual. | `docs/design/first-screen/verify-ui-report.md` + screenshots | [x] |
## 17. Requirement coverage

| Requirement | Covered by DoD IDs | Gap |
|---|---|---|
| BR-01 | DOD-02, DOD-05, DOD-10 | none |
| BR-02 | DOD-02, DOD-06, DOD-10 | none |
| BR-03 | DOD-04, DOD-05, DOD-10 | none |
| BR-04 | DOD-05, DOD-10 | none |
| BR-05 | DOD-05, DOD-10 | none |
| BR-06 | DOD-02, DOD-04, DOD-10 | none |
| BR-07 | DOD-03, DOD-10 | none |
| BR-08 | DOD-03, DOD-10 | none |
| BR-09 | DOD-08, DOD-10 | none |
| BR-10 | DOD-06, DOD-10 | none |
| BR-11 | DOD-07, DOD-10 | none |
| BR-12 | DOD-01, DOD-09, DOD-10 | none |

## 18. Final gate

- [x] Every requirement is covered by at least one DoD row.
- [x] Every applicable DoD row is checked and links to evidence.
- [ ] Every `Proposed` decision (section 14) was approved or removed before implementation.
- [x] Deterministic checks and live browser verification both passed. (First run 11 of 12; 12 of 12 after the focus ring fix.)
- [x] The final repository diff matches the approved scope.
