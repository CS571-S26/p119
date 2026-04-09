import { BookPlus } from "lucide-react"
import { GenericDataCard } from "@/components/data-card/generic-data-card"

interface GPADataCardProps {
  termGPA: number | null
  cumulativeGPA: number | null
}

function calculateColorFromGPA(gpa: number | null) {
  if (gpa === null) return ""
  if (gpa >= 3.5) return "text-green-600 dark:text-green-400"
  if (gpa >= 3.0) return "text-amber-600 dark:text-yellow-400"
  if (gpa >= 2.5) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

export function GPADataCard({ termGPA, cumulativeGPA }: GPADataCardProps) {
  return (
    <GenericDataCard
      title="Grade Point Average"
      icon={BookPlus}
      className={calculateColorFromGPA(termGPA)}
      value={termGPA}
      reference={cumulativeGPA}
      comparisonKeyword="historical"
    />
  )
}