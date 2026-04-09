import { Users } from "lucide-react"
import { GenericDataCard } from "@/components/data-card/generic-data-card"

interface ClassSizeDataCardProps {
  termClassSize: number | null
  cumulativeAverageClassSize: number | null
}

export function ClassSizeDataCard({
  termClassSize,
  cumulativeAverageClassSize,
}: ClassSizeDataCardProps) {
  return (
    <GenericDataCard
      title="Class Size"
      icon={Users}
      value={termClassSize}
      reference={cumulativeAverageClassSize}
      comparisonKeyword="historical"
    />
  )
}