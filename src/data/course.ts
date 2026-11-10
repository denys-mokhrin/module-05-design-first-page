export type ModuleStatus = "done" | "in-progress" | "upcoming"

export type Destination = "platform" | "telegram"

export interface Tally {
  done: number
  total: number
}

export interface CourseModule {
  number: number
  title: string
  /** Release date as printed in the course schedule, e.g. "30 Sep". */
  released: string
  practiceSubmitted: number
  practiceTotal: number
  status: ModuleStatus
}

export interface QueueItem {
  id: string
  lesson: string
  handIn: string
  destination: Destination
}

export interface Course {
  name: string
  lessons: Tally
  practice: Tally
  modules: CourseModule[]
  queue: QueueItem[]
}

export const course: Course = {
  name: "Agentic Engineering 3.0",
  lessons: { done: 51, total: 104 },
  practice: { done: 29, total: 76 },
  modules: [
    { number: 1, title: "How LLMs work", released: "30 Sep", practiceSubmitted: 4, practiceTotal: 4, status: "done" },
    { number: 2, title: "How agents work", released: "7 Oct", practiceSubmitted: 3, practiceTotal: 3, status: "done" },
    { number: 3, title: "Working environment", released: "14 Oct", practiceSubmitted: 10, practiceTotal: 10, status: "done" },
    { number: 4, title: "Prompts, context, boundaries", released: "21 Oct", practiceSubmitted: 11, practiceTotal: 11, status: "done" },
    { number: 5, title: "Tooling, plugins, design system", released: "28 Oct", practiceSubmitted: 7, practiceTotal: 11, status: "in-progress" },
    { number: 6, title: "SDLC phase 1", released: "4 Nov", practiceSubmitted: 0, practiceTotal: 9, status: "in-progress" },
    { number: 7, title: "First feature", released: "11 Nov", practiceSubmitted: 0, practiceTotal: 0, status: "upcoming" },
    { number: 8, title: "MCP", released: "18 Nov", practiceSubmitted: 0, practiceTotal: 0, status: "upcoming" },
    { number: 9, title: "Worktrees, PR, review", released: "25 Nov", practiceSubmitted: 0, practiceTotal: 0, status: "upcoming" },
    { number: 10, title: "Subagents and evals", released: "2 Dec", practiceSubmitted: 0, practiceTotal: 0, status: "upcoming" },
    { number: 11, title: "Production", released: "9 Dec", practiceSubmitted: 0, practiceTotal: 0, status: "upcoming" },
  ],
  queue: [
    { id: "5.8", lesson: "5.8 Design with Claude", handIn: "Page screenshot next to the brief", destination: "platform" },
    { id: "5.9", lesson: "5.9 Figma / Pencil", handIn: "Desktop and mobile screen next to the brief", destination: "platform" },
    { id: "m5-checklist", lesson: "Module 5 checklist", handIn: "Summary of the module", destination: "platform" },
    { id: "capstone", lesson: "Capstone: plugin for my own SaaS", handIn: "Plugin repo and PR", destination: "telegram" },
  ],
}

/** Practice still open in modules that have already been released. */
export function openPractice(modules: CourseModule[]) {
  return modules
    .filter((m) => m.status !== "upcoming" && m.practiceSubmitted < m.practiceTotal)
    .map((m) => ({ number: m.number, open: m.practiceTotal - m.practiceSubmitted }))
}
