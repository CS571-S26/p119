import { GPADataCard } from "@/components/data-card/gpa-data-card"
import { CompletionRateDataCard } from "@/components/data-card/completion-rate-data-card"
import { ARateDataCard } from "@/components/data-card/a-rate-data-card"
import { ClassSizeDataCard } from "@/components/data-card/class-size-data-card"
import { GradeDistributionChart } from "@/components/course/grade-distribution-chart"
import type { CourseStats } from "@/lib/course-types"

interface CourseOverviewProps {
  stats: CourseStats
}

export function CourseOverview({ stats }: CourseOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GPADataCard
          termGPA={stats.termGPA}
          cumulativeGPA={stats.cumulativeGPA}
        />
        <CompletionRateDataCard
          termCompletionRate={stats.termCompletionRate}
          cumulativeCompletionRate={stats.cumulativeCompletionRate}
        />
        <ARateDataCard
          termARate={stats.termARate}
          cumulativeARate={stats.cumulativeARate}
        />
        <ClassSizeDataCard
          termClassSize={stats.termClassSize}
          cumulativeAverageClassSize={stats.cumulativeAverageClassSize}
        />
      </div>
      <GradeDistributionChart grades={stats.gradeDistribution} />
    </div>
  )
}
