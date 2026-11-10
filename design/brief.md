# Brief: course homework tracker (single page)

## Subject and user

One page that shows where I stand in the course "Agentic Engineering 3.0".
The user is me, a student who works on homework in the evening after the day job.
I open the page to answer one question in ten seconds: what do I submit next, and how far behind am I.
Usually a laptop, sometimes a phone on the way home.

## Data (typed, no backend, lives in one file)

Header: course name, today's date, two counters: lessons 51 of 104, practice 29 of 76.

Eleven modules. Each module has: number, title, release date, practice submitted, practice total,
status. Status is one of three values: done, in progress, upcoming.

| # | Title | Released | Practice | Status |
|---|---|---|---|---|
| 1 | How LLMs work | 30 Sep | 4 / 4 | done |
| 2 | How agents work | 7 Oct | 3 / 3 | done |
| 3 | Working environment | 14 Oct | 10 / 10 | done |
| 4 | Prompts, context, boundaries | 21 Oct | 11 / 11 | done |
| 5 | Tooling, plugins, design system | 28 Oct | 7 / 11 | in progress |
| 6 | SDLC phase 1 | 4 Nov | 0 / 9 | in progress |
| 7 | First feature | 11 Nov | 0 / 0 | upcoming |
| 8 | MCP | 18 Nov | 0 / 0 | upcoming |
| 9 | Worktrees, PR, review | 25 Nov | 0 / 0 | upcoming |
| 10 | Subagents and evals | 2 Dec | 0 / 0 | upcoming |
| 11 | Production | 9 Dec | 0 / 0 | upcoming |

"Next up" queue, four items. Each item has: lesson, what to hand in, where it goes
(platform or Telegram), and a button "Mark as submitted".

1. 5.8 Design with Claude: page screenshot next to the brief, platform
2. 5.9 Figma / Pencil: desktop and mobile screen next to the brief, platform
3. Module 5 checklist: summary of the module, platform
4. Capstone, plugin for my own SaaS: plugin repo and PR, Telegram

## Four dimensions

Typography. The voice of a paper gradebook, not a SaaS dashboard: a serif with character for the
page title and module titles, a clean sans for everything else, tabular figures for every counter
and date. No Inter, no Roboto, no Arial.

Color and theme. Light theme by default, dark theme through `.dark`. Use only the tokens already
in `src/index.css` (supabase theme): `--primary` means "submitted", muted means "upcoming",
one warning accent for "in progress". If a new color is needed, it goes into the tokens first,
never as a bare hex in markup.

Motion. One restrained moment: progress bars fill once on page load. Nothing else moves.
Respect `prefers-reduced-motion`.

Backgrounds and surfaces. Calm paper-like background from `--background`, modules on `--card`
with a thin border instead of a heavy shadow. Desktop: the queue on the left as the main thing,
modules as a dense grid on the right. Mobile: one column, queue first.

## Constraints

Use the installed `Button` and `Card` from `src/components/ui`; add other components only through
`pnpm dlx shadcn@latest add <name>`, no look-alike primitives. Data enters components as typed
props, status is a union type. All page text in English.
