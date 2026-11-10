# Design brief

Screen: "Next up" queue, the left block of the course homework tracker page

Current URL: http://localhost:5183/

Goal: I should see the next thing to submit and where it goes at a glance, without reading
three lines of text per item, and a finished queue should look finished, not like an empty list.

Keep:

- "Mark as submitted" crosses the item out and shows "Submitted" with an "Undo" button; "Undo" brings it back
- the counter in the block header ("4 to hand in", then "Queue cleared") follows the buttons
- the first item that is not submitted yet is the visually strongest one
- the installed `Button` and `Card` from `src/components/ui` and the tokens in `src/index.css`
- data comes from `src/data/course.ts` as typed props; destination is `"platform" | "telegram"`

States:

- default: four items, the first one emphasized
- success: an item marked as submitted (crossed out, quiet, with "Undo")
- empty: all items submitted, the block says the queue is cleared and what opens next
- loading: N/A (data is a local file)
- error: N/A
- disabled: N/A

Layouts:

- desktop: 1440px
- mobile: 390px

Design references:

- current screenshot: design/current-desktop.png, design/current-mobile.png
- desktop frame: "Next up / desktop", node `q4z8Y`
- mobile frame: "Next up / mobile", node `c3J0N4`
- state frames: "Next up / desktop · submitted" `h80BKq`, "Next up / desktop · empty" `XoPp4`,
  "Next up / mobile · submitted" `fJsLM`, "Next up / mobile · empty" `NIF9p`
- Pencil source: design/main-screen.pen

Done:

- the approved design is implemented in the existing screen;
- the behavior from the Keep section works;
- project checks pass;
- desktop and mobile are checked in the browser;
- Git diff matches the task.
