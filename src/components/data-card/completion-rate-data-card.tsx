import { CircleCheckBig } from "lucide-react"
import { GenericDataCard } from "@/components/data-card/generic-data-card"

interface CompletionRateDataCardProps {
  termCompletionRate: number | null
  cumulativeCompletionRate: number | null
}

export function CompletionRateDataCard({
  termCompletionRate,
  cumulativeCompletionRate,
}: CompletionRateDataCardProps) {
  return (
    <GenericDataCard
      title="Completion Rate"
      icon={CircleCheckBig}
      value={termCompletionRate}
      suffix="%"
      reference={cumulativeCompletionRate}
      comparisonKeyword="historical"
    />
  )
}