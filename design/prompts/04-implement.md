# Approved design -> code -> browser

The design in `design/main-screen.pen` is approved by me:

- desktop frame: "Next up / desktop", node `q4z8Y`
- mobile frame: "Next up / mobile", node `c3J0N4`
- state frames: `h80BKq`, `XoPp4`, `fJsLM`, `NIF9p`

First write these frame names and node IDs into the "Design references" section of
`design/brief.md`.

Then implement the approved "Next up" block in this repository.

Before editing:

1. read `design/brief.md` and `design/definition-of-done.md`;
2. inspect the current screen and identify its existing owner;
3. inspect the approved desktop and mobile frames through Pencil;
4. list the small set of files you plan to change.

Implementation rules:

- preserve the working behavior named in the brief (Mark as submitted, Undo, the counter);
- reuse the existing `Button` and `Card`, the tokens in `src/index.css` and the project conventions;
- do not add a new UI library; add a shadcn component only through `pnpm dlx shadcn@latest add <name>`;
- no bare color values in markup: a new value goes into the tokens first;
- implement desktop and mobile from one responsive screen;
- include the states from the brief: default, submitted, empty queue;
- data stays typed in `src/data/course.ts` and enters the components as props;
- modify the real current screen, not a separate demo route;
- change only the "Next up" block, leave the header and the module grid as they are.

After editing:

- run the checks that exist in this repo: `pnpm exec tsc -p tsconfig.app.json --noEmit`, `pnpm lint`, `pnpm build`;
- the dev server is already running at http://localhost:5183/, do not start another one;
- compare desktop 1440px and mobile 390px with the approved frames;
- verify the behavior from the Keep section;
- report changed files (`git status --short`, `git diff --stat`) and remaining differences.

Do not commit.
