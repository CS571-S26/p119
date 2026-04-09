import type { ComponentType, SVGProps } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Change } from "@/components/data-card/change"
import { cn } from "@/lib/utils"

interface GenericDataCardProps {
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  className?: string
  value: number | null
  suffix?: string
  reference: number | null
  comparisonKeyword: string
}

const formatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function GenericDataCard({
  title,
  icon: Icon,
  className,
  value,
  suffix = "",
  reference,
  comparisonKeyword,
}: GenericDataCardProps) {
  const points =
    reference !== null && value !== null && reference !== 0
      ? (value - reference) / reference
      : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", className)}>
          {value !== null ? (
            <>
              {formatter.format(value)}
              {suffix}
            </>
          ) : (
            "Not Reported"
          )}
        </div>
        <Change
          className="mt-0.5 text-xs"
          comparisonKeyword={comparisonKeyword}
          points={points}
        />
      </CardContent>
    </Card>
  )
}