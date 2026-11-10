import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CourseModule, ModuleStatus } from "@/data/course"
import { TallyCells } from "./tally"

const statusText: Record<ModuleStatus, string> = {
  done: "Done",
  "in-progress": "In progress",
  upcoming: "Upcoming",
}

function StatusMark({ status }: { status: ModuleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex self-start items-center rounded-sm px-1.5 py-0.5 text-xs font-medium",
        status === "done" && "bg-primary text-primary-foreground",
        status === "in-progress" && "bg-warning text-warning-foreground",
        status === "upcoming" && "bg-muted text-muted-foreground"
      )}
    >
      {statusText[status]}
    </span>
  )
}

function ModuleCard({ module, delay }: { module: CourseModule; delay: number }) {
  const upcoming = module.status === "upcoming"
  return (
    <Card
      size="sm"
      className={cn(
        "flex-row gap-2.5 rounded-lg px-3 shadow-none ring-border",
        upcoming && "bg-muted/40"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "figures w-7 shrink-0 font-heading text-2xl leading-none",
          upcoming ? "text-muted-foreground/70" : "text-foreground"
        )}
      >
        {module.number}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <StatusMark status={module.status} />
          <h3
            className={cn(
              "font-heading text-lg leading-snug font-medium",
              upcoming && "text-muted-foreground"
            )}
          >
            <span className="sr-only">Module {module.number}: </span>
            {module.title}
          </h3>
        </div>
        {module.practiceTotal > 0 ? (
          <div className="flex flex-col gap-1.5">
            <TallyCells submitted={module.practiceSubmitted} total={module.practiceTotal} delay={delay} />
            <span className="figures text-xs text-muted-foreground">
              {module.practiceSubmitted} of {module.practiceTotal} submitted
            </span>
          </div>
        ) : upcoming ? null : (
          <p className="text-xs text-muted-foreground">No practice in this module</p>
        )}
        <p className="figures mt-auto text-xs text-muted-foreground">
          {upcoming ? `Opens ${module.released}` : `Released ${module.released}`}
        </p>
      </div>
    </Card>
  )
}

export function ModuleGrid({ modules }: { modules: CourseModule[] }) {
  return (
    <section aria-labelledby="modules" className="flex flex-col gap-4">
      <h2 id="modules" className="font-heading text-2xl font-medium">
        Modules
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m, i) => (
          <li key={m.number} className="flex *:flex-1">
            <ModuleCard module={m} delay={200 + i * 60} />
          </li>
        ))}
      </ul>
    </section>
  )
}
