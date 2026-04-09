import { BookA } from "lucide-react"
import { GenericDataCard } from "@/components/data-card/generic-data-card"

interface ARateDataCardProps {
  termARate: number | null
  cumulativeARate: number | null
}

export function ARateDataCard({
  termARate,
  cumulativeARate,
}: ARateDataCardProps) {
  return (
    <GenericDataCard
      title="A Rate"
      icon={BookA}
      value={termARate}
      suffix="%"
      reference={cumulativeARate}
      comparisonKeyword="historical"
    />
  )
}
