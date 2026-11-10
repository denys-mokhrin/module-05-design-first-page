import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Destination, QueueItem } from "@/data/course"

const destinationText: Record<Destination, string> = {
  platform: "Hand in on the platform",
  telegram: "Send in Telegram",
}

function QueueRow({
  item,
  position,
  isNext,
  submitted,
  onToggle,
}: {
  item: QueueItem
  position: number
  isNext: boolean
  submitted: boolean
  onToggle: () => void
}) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-x-3 px-5 py-5 sm:px-6">
      <span
        aria-hidden
        className={cn(
          "figures font-heading text-2xl leading-none",
          submitted ? "text-muted-foreground/60" : "text-foreground"
        )}
      >
        {position}
      </span>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              "figures font-medium",
              isNext ? "text-lg leading-snug" : "text-base",
              submitted && "text-muted-foreground line-through decoration-1"
            )}
          >
            {item.lesson}
          </h3>
          <p className={cn("text-sm", submitted ? "text-muted-foreground/70" : "text-muted-foreground")}>
            {item.handIn}
          </p>
          <p className="text-xs text-muted-foreground">{destinationText[item.destination]}</p>
        </div>
        <div className="flex items-center gap-3">
          {submitted ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                <CheckIcon className="size-4 rounded-full bg-primary p-0.5 text-primary-foreground" />
                Submitted
              </span>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                Undo
              </Button>
            </>
          ) : (
            <Button size={isNext ? "lg" : "default"} variant={isNext ? "default" : "outline"} onClick={onToggle}>
              Mark as submitted
            </Button>
          )}
        </div>
      </div>
    </li>
  )
}

export function NextUpQueue({ items }: { items: QueueItem[] }) {
  const [submitted, setSubmitted] = useState<ReadonlySet<string>>(new Set())
  const nextId = items.find((i) => !submitted.has(i.id))?.id
  const remaining = items.length - submitted.size

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
      <Card className="gap-0 rounded-lg py-0 shadow-none ring-border">
        <ol className="divide-y">
          {items.map((item, i) => (
            <QueueRow
              key={item.id}
              item={item}
              position={i + 1}
              isNext={item.id === nextId}
              submitted={submitted.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </ol>
      </Card>
    </section>
  )
}
