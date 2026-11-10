import type { Tally } from "@/data/course"
import { Meter } from "./tally"

interface Behind {
  number: number
  open: number
}

function Counter({ label, tally, delay }: { label: string; tally: Tally; delay: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="figures font-heading text-3xl leading-none">
        {tally.done}
        <span className="text-lg text-muted-foreground"> of {tally.total}</span>
      </p>
      <Meter done={tally.done} total={tally.total} delay={delay} label={`${label}: ${tally.done} of ${tally.total}`} />
    </div>
  )
}

function BehindLine({ behind }: { behind: Behind[] }) {
  const total = behind.reduce((sum, b) => sum + b.open, 0)
  if (total === 0) {
    return <p className="text-sm">All released practice is submitted.</p>
  }
  const parts = behind.map((b) => `${b.open} in module ${b.number}`).join(", ")
  return (
    <p className="flex items-baseline gap-2 text-sm">
      <span aria-hidden className="size-2 shrink-0 translate-y-[-1px] rounded-full bg-warning" />
      <span>
        <span className="figures font-medium">
          {total} practice {total === 1 ? "task" : "tasks"} behind
        </span>
        <span className="figures text-muted-foreground">: {parts}.</span>
      </span>
    </p>
  )
}

export function CourseHeader({
  name,
  today,
  lessons,
  practice,
  behind,
}: {
  name: string
  today: Date
  lessons: Tally
  practice: Tally
  behind: Behind[]
}) {
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today)

  return (
    <header className="flex flex-col gap-8 border-b pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="font-heading text-4xl leading-tight font-medium tracking-tight [font-optical-sizing:auto] sm:text-5xl">
          {name}
        </h1>
        <time dateTime={today.toISOString().slice(0, 10)} className="figures text-sm text-muted-foreground">
          {date}
        </time>
      </div>
      <div className="grid gap-6 sm:grid-cols-[1fr_1fr_1.4fr] sm:items-end sm:gap-10">
        <Counter label="Lessons" tally={lessons} delay={0} />
        <Counter label="Practice" tally={practice} delay={120} />
        <BehindLine behind={behind} />
      </div>
    </header>
  )
}
