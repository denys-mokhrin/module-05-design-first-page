# Transaction 2 of 3: components only

Continue in `design/main-screen.pen` through Pencil.

Add the two font variables you need (Newsreader for headings, Geist for text).

Create reusable components for the repeated controls of the "Next up" queue from
`design/brief.md`, using only the variables:

- a queue row in three states: next item (emphasized), regular item, submitted item
  (crossed out, with "Undo");
- the primary and outline "Mark as submitted" buttons;
- a destination tag for platform and telegram;
- the block header with the counter;
- the empty state for a cleared queue.

Keep them consistent with the existing `Button` and `Card` in `src/components/ui`.
Do not build the desktop or mobile frames yet.

After writing: report component names, states and node IDs, take a screenshot of the
components and check it for clipping and overlap, save the file, and stop for review.
