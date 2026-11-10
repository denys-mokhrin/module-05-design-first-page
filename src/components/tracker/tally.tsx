import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

function delayStyle(ms: number) {
  return { "--tally-delay": `${ms}ms` } as CSSProperties
}

/**
 * One cell per practice task, like ticks in a paper gradebook.
 * Cells have a fixed width so a module's size is visible at a glance.
 */
export function TallyCells({
  submitted,
  total,
  delay = 0,
  className,
}: {
  submitted: number
  total: number
  delay?: number
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`${submitted} of ${total} practice tasks submitted`}
      className={cn("flex flex-wrap gap-[2px]", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="relative h-4 w-2.5 overflow-hidden rounded-[2px] bg-muted ring-1 ring-border ring-inset"
        >
          {i < submitted && (
            <span
              className="tally-fill absolute inset-0 bg-primary"
              style={delayStyle(delay + i * 40)}
            />
          )}
        </span>
      ))}
    </div>
  )
}

/** A continuous bar for totals too large to draw cell by cell. */
export function Meter({
  done,
  total,
  delay = 0,
  label,
}: {
  done: number
  total: number
  delay?: number
  label: string
}) {
  const pct = total === 0 ? 0 : (done / total) * 100
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset"
    >
      <div className="h-full" style={{ width: `${pct}%` }}>
        <div className="tally-fill h-full rounded-full bg-primary" style={delayStyle(delay)} />
      </div>
    </div>
  )
}
