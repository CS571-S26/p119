import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { totalGrades, type GradeDistribution } from "@/lib/course-types"

interface GradeDistributionChartProps {
  grades: GradeDistribution
}

const GRADE_COLORS: Record<string, string> = {
  A: "#2ECC71",
  AB: "#27AE60",
  B: "#F1C40F",
  BC: "#F39C12",
  C: "#E67E22",
  D: "#E74C3C",
  F: "#C0392B",
  Other: "#6F6F6F",
}

const chartConfig = {
  count: { label: "Students" },
} satisfies ChartConfig

export function GradeDistributionChart({ grades }: GradeDistributionChartProps) {
  const total = totalGrades(grades)
  const data = [
    { grade: "A", count: grades.a },
    { grade: "AB", count: grades.ab },
    { grade: "B", count: grades.b },
    { grade: "BC", count: grades.bc },
    { grade: "C", count: grades.c },
    { grade: "D", count: grades.d },
    { grade: "F", count: grades.f },
    { grade: "Other", count: grades.other },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="grade"
              type="category"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const n = Number(value)
                    const pct = total > 0 ? (n / total) * 100 : 0
                    return `${n.toLocaleString()} (${pct.toFixed(1)}%)`
                  }}
                />
              }
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((d) => (
                <Cell key={d.grade} fill={GRADE_COLORS[d.grade]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <p className="text-muted-foreground mt-4 text-center text-xs">
          Cumulative Grade Distribution · {total.toLocaleString()} students
        </p>
      </CardContent>
    </Card>
  )
}
