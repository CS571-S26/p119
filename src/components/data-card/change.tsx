import { MoveRight, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChangeProps {
  className?: string
  points: number | null
  comparisonKeyword?: string
  trendSize?: number
}

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function calculateColorFromChange(points: number | null) {
  if (points === null || points === 0) return "text-muted-foreground"
  if (points > 0) return "text-green-600 dark:text-green-400"
  return "text-red-600 dark:text-red-400"
}

export function Change({
  className,
  points,
  comparisonKeyword = "",
  trendSize = 14,
}: ChangeProps) {
  return (
    <p
      className={cn(
        "flex items-center",
        className,
        calculateColorFromChange(points)
      )}
    >
      <span className="mr-1.5">
        {points ? (
          points > 0 ? (
            <TrendingUp size={trendSize} />
          ) : points < 0 ? (
            <TrendingDown size={trendSize} />
          ) : (
            <MoveRight size={trendSize} />
          )
        ) : null}
      </span>
      {points !== null ? (
        points ? (
          <>
            <span>{percentFormatter.format(points)}</span>
            <span className="ml-1 line-clamp-1 overflow-ellipsis break-all">
              from {comparisonKeyword}
            </span>
          </>
        ) : (
          <>No change from {comparisonKeyword}</>
        )
      ) : (
        <>Could not calculate change</>
      )}
    </p>
  )
}