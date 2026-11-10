# Design system: course homework tracker

One file holds the system: `src/index.css`. Components never carry raw color values; a new
value goes into the tokens first.

## Two layers

1. **Palette (values).** `:root` for the light theme and `.dark` for the dark theme define the
   same names with different OKLCH values. Base: the supabase theme from the tweakcn registry.
2. **Roles (names).** `@theme inline` maps the names to Tailwind utilities (`--color-primary`
   becomes `bg-primary`, `text-primary`), so components refer to the role, not to the value.

## Color tokens

| Role | Token | Light | Dark | Used for |
|---|---|---|---|---|
| Page background | `--background` | `oklch(0.9911 0 0)` | `oklch(0.1822 0 0)` | page |
| Text | `--foreground` | `oklch(0.2046 0 0)` | `oklch(0.9288 0.0126 255.5078)` | titles, body |
| Surface | `--card` | `oklch(0.9911 0 0)` | `oklch(0.2046 0 0)` | module cards, queue card |
| Action, "submitted" | `--primary` | `oklch(0.54 0.115 160.9080)` | `oklch(0.4365 0.1044 156.7556)` | primary button, filled progress cells, "Done" tag, "Hand in next" |
| Text on action | `--primary-foreground` | `oklch(0.985 0.012 166.4589)` | `oklch(0.9213 0.0135 167.1556)` | button label |
| Quiet surface | `--muted` | `oklch(0.9461 0 0)` | `oklch(0.2393 0 0)` | upcoming cards, tags, emphasized row |
| Secondary text | `--muted-foreground` | `oklch(0.2435 0 0)` | `oklch(0.7122 0 0)` | hand-in lines, counters |
| "In progress" | `--warning` | `oklch(0.7686 0.1647 70.0804)` | `oklch(0.8369 0.1644 84.4286)` | "In progress" tag, "behind" dot |
| Text on warning | `--warning-foreground` | `oklch(0.3 0.06 60)` | `oklch(0.26 0.05 70)` | tag label |
| Lines | `--border` | `oklch(0.9037 0 0)` | `oklch(0.2809 0 0)` | card ring, row separators |

History of changes to the base theme:

- `--warning` / `--warning-foreground` were added for the "in progress" status (lesson 5.8).
- Light `--primary` was darkened from `oklch(0.8348 0.1302 160.9080)` so filled cells read on a
  white background; `--primary-foreground` changed with it to keep button text readable.

- Light `--ring` was changed from the pale mint `oklch(0.8348 0.1302 160.9080)` to
  `oklch(0.22 0.04 160.9080)` after the live check: the focus ring is drawn at 50% opacity and
  measured about 1.2:1 against the page; it is now 3.24:1 – 3.32:1.

Known issue: `--chart-1` and `--sidebar-primary` still hold the old pale mint; nothing on the page
uses them.

Known issue: light `--muted-foreground` is nearly black, so "secondary" text is not visibly
quieter than body text in the light theme; submitted rows use opacity instead.

## Typography

| Role | Token | Family | Used for |
|---|---|---|---|
| Headings | `--font-heading` | Newsreader Variable, fallback Georgia | page title, block titles, module titles, large numbers |
| Text | `--font-sans` | Geist Variable, fallback system UI | everything else |

Numbers use the `.figures` utility (`font-variant-numeric: tabular-nums lining-nums`) on every
counter and date. Labels are sentence case; no all-caps labels.

## Shape and spacing

| Token | Value |
|---|---|
| `--radius` | `0.5rem` |
| `--radius-sm` / `-md` / `-lg` / `-xl` | 0.6 / 0.8 / 1 / 1.4 of `--radius` |
| Spacing | Tailwind scale on a 4px base |

Surfaces use a 1px ring from `--border` instead of a shadow.

## Motion

One moment only: progress cells fill once on page load (`.tally-fill`, 560ms). The rule
`@media (prefers-reduced-motion: reduce)` turns it off. Nothing else moves.

## Components

Installed primitives (shadcn/ui, `src/components/ui`). New ones are added only with
`pnpm dlx shadcn@latest add <name>`.

| Component | File | Variants in use |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | `default` (primary action), `outline` (secondary action, "Undo"); sizes `default`, `sm` |
| `Card` | `src/components/ui/card.tsx` | surface for module cards and the queue |

Page components (`src/components/tracker`), all built from the primitives and tokens:

| Component | File | Data it takes |
|---|---|---|
| `CourseHeader` | `course-header.tsx` | course name, date, `Tally` for lessons and practice, list of modules that are behind |
| `NextUpQueue` | `next-up-queue.tsx` | `QueueItem[]`, optional `opensNext` module |
| `ModuleGrid` | `module-grid.tsx` | `CourseModule[]` |
| `TallyCells`, `Meter` | `tally.tsx` | `done` and `total` numbers |

Local parts inside `NextUpQueue`: `DestinationTag`, `OpenRow`, `SubmittedRow`, `QueueCleared`.

## Data contract

Everything comes from `src/data/course.ts` as typed props:

- `ModuleStatus = "done" | "in-progress" | "upcoming"`
- `Destination = "platform" | "telegram"`
- `CourseModule`, `QueueItem`, `Tally`, `Course`
- helpers `openPractice(modules)` and `nextOpening(modules)`

## Design source

The same variables live in `design/main-screen.pen` (Pencil): 10 colors with Light and Dark
values, radii, spacing, two fonts, and nine reusable components for the queue.
