import { useState } from "react"
import { CheckIcon, MonitorIcon, SendIcon, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CourseModule, Destination, QueueItem } from "@/data/course"

const destinations: Record<Destination, { label: string; icon: LucideIcon }> = {
  platform: { label: "Platform", icon: MonitorIcon },
  telegram: { label: "Telegram", icon: SendIcon },
}

function DestinationTag({ destination }: { destination: Destination }) {
  const { label, icon: Icon } = destinations[destination]
  return (
    <span className="inline-flex h-5.5 shrink-0 items-center gap-1 rounded-sm bg-muted px-2 text-xs font-medium whitespace-nowrap">
      <Icon aria-hidden className="size-3" />
      <span className="sr-only">Hand in on </span>
      {label}
    </span>
  )
}

function SubmittedRow({
  item,
  position,
  onUndo,
}: {
  item: QueueItem
  position: number
  onUndo: () => void
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-3.5">
      <span aria-hidden className="figures w-6 shrink-0 font-heading text-[22px] leading-none text-muted-foreground opacity-50">
        {position}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="figures text-[15px] text-muted-foreground line-through decoration-1 opacity-70">
          {item.lesson}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
          <CheckIcon aria-hidden className="size-3.5" />
          Submitted
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onUndo}>
        Undo
      </Button>
    </li>
  )
}

function OpenRow({
  item,
  position,
  isNext,
  onSubmit,
}: {
  item: QueueItem
  position: number
  isNext: boolean
  onSubmit: () => void
}) {
  return (
    <li
      className={cn(
        "grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 p-5",
        isNext && "border-l-3 border-l-primary bg-muted pl-[17px]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "figures font-heading leading-none",
          isNext ? "text-2xl text-primary" : "text-[22px] text-muted-foreground"
        )}
      >
        {position}
      </span>
      <div className={cn("flex flex-col", isNext ? "gap-2" : "gap-1.5")}>
        {isNext && <p className="text-xs font-semibold tracking-wide text-primary">Hand in next</p>}
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "figures",
              isNext ? "font-heading text-[22px] leading-tight font-medium" : "text-base leading-[1.35] font-medium"
            )}
          >
            {item.lesson}
          </h3>
          <DestinationTag destination={item.destination} />
        </div>
        <p className="text-sm text-muted-foreground">{item.handIn}</p>
        <div className={isNext ? "pt-1" : "pt-1.5"}>
          <Button variant={isNext ? "default" : "outline"} onClick={onSubmit}>
            Mark as submitted
          </Button>
        </div>
      </div>
    </li>
  )
}

function QueueCleared({ opensNext }: { opensNext?: Pick<CourseModule, "number" | "title" | "released"> }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <CheckIcon aria-hidden className="size-5" />
      </span>
      <h3 className="font-heading text-2xl font-medium">Queue cleared</h3>
      <p className="text-sm leading-normal text-muted-foreground">
        Every released hand-in is submitted. Nothing is due until the next module opens.
      </p>
      {opensNext && (
        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg bg-muted px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Opens next</span>
          <span className="text-sm font-medium">
            Module {opensNext.number} · {opensNext.title}
          </span>
          <span className="figures text-sm text-muted-foreground">{opensNext.released}</span>
        </p>
      )}
    </div>
  )
}

export function NextUpQueue({
  items,
  opensNext,
}: {
  items: QueueItem[]
  opensNext?: Pick<CourseModule, "number" | "title" | "released">
}) {
  const [submitted, setSubmitted] = useState<ReadonlySet<string>>(new Set())
  const nextId = items.find((i) => !submitted.has(i.id))?.id
  const remaining = items.filter((i) => !submitted.has(i.id)).length

  const toggle = (id: string) =>
    setSubmitted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section aria-labelledby="next-up" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="next-up" className="font-heading text-2xl font-medium">
          Next up
        </h2>
        <p className="figures text-sm text-muted-foreground" aria-live="polite">
          {remaining === 0 ? "Queue cleared" : `${remaining} to hand in`}
        </p>
      </div>
      <Card className="gap-0 py-0 shadow-none ring-border">
        {remaining === 0 && <QueueCleared opensNext={opensNext} />}
        <ol className={cn("divide-y", remaining === 0 && "border-t")}>
          {items.map((item, i) =>
            submitted.has(item.id) ? (
              <SubmittedRow key={item.id} item={item} position={i + 1} onUndo={() => toggle(item.id)} />
            ) : (
              <OpenRow
                key={item.id}
                item={item}
                position={i + 1}
                isNext={item.id === nextId}
                onSubmit={() => toggle(item.id)}
              />
            )
          )}
        </ol>
      </Card>
    </section>
  )
}
