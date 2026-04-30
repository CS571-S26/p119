import type { ApiCourse, ApiGradeData } from "@/lib/api"

export interface CourseReference {
  subject: string
  courseNumber: number
}

export interface Course {
  courseReference: CourseReference
  courseTitle: string
  description: string
  prerequisites?: string
  satisfies?: string
  credits: string
  typicallyOffered: string
}

export interface CourseStats {
  termGPA: number | null
  cumulativeGPA: number | null
  termCompletionRate: number | null
  cumulativeCompletionRate: number | null
  termARate: number | null
  cumulativeARate: number | null
  termClassSize: number | null
  cumulativeAverageClassSize: number | null
  gradeDistribution: GradeDistribution
}

export interface GradeDistribution {
  a: number
  ab: number
  b: number
  bc: number
  c: number
  d: number
  f: number
  other: number
}

export function totalGrades(g: GradeDistribution): number {
  return g.a + g.ab + g.b + g.bc + g.c + g.d + g.f + g.other
}

export function formatCourseReference(ref: CourseReference): string {
  return `${ref.subject} ${ref.courseNumber}`
}

function gradeDistFromApi(g: ApiGradeData): GradeDistribution {
  const other =
    g.credit +
    g.incomplete +
    g.no_credit +
    g.no_work +
    g.not_reported +
    g.other +
    g.passed +
    g.satisfactory +
    g.unsatisfactory
  return {
    a: g.a,
    ab: g.ab,
    b: g.b,
    bc: g.bc,
    c: g.c,
    d: g.d,
    f: g.f,
    other,
  }
}

function gpaFromGradeData(g: ApiGradeData): number | null {
  const graded = g.a + g.ab + g.b + g.bc + g.c + g.d + g.f
  if (graded === 0) return null
  const points =
    g.a * 4 + g.ab * 3.5 + g.b * 3 + g.bc * 2.5 + g.c * 2 + g.d * 1
  return points / graded
}

function aRateFromGradeData(g: ApiGradeData): number | null {
  if (g.total === 0) return null
  return (g.a / g.total) * 100
}

function completionRateFromGradeData(g: ApiGradeData): number | null {
  if (g.total === 0) return null
  const failed = g.f + g.incomplete + g.no_work + g.not_reported
  return ((g.total - failed) / g.total) * 100
}

function latestTermWithGrades(
  termData: ApiCourse["term_data"],
): { id: string; data: ApiGradeData } | null {
  const entries = Object.entries(termData)
    .filter(([, t]) => t.grade_data !== null)
    .sort(([a], [b]) => b.localeCompare(a))
  if (entries.length === 0) return null
  return { id: entries[0][0], data: entries[0][1].grade_data! }
}

function latestEnrollmentTerm(
  termData: ApiCourse["term_data"],
): ApiCourse["term_data"][string]["enrollment_data"] | null {
  const entries = Object.entries(termData)
    .filter(([, t]) => t.enrollment_data !== null)
    .sort(([a], [b]) => b.localeCompare(a))
  if (entries.length === 0) return null
  return entries[0][1].enrollment_data
}

function formatCreditCount(count: [number, number]): string {
  return count[0] === count[1] ? `${count[0]}` : `${count[0]}-${count[1]}`
}

export function mapApiCourse(api: ApiCourse): Course {
  const enrollment = latestEnrollmentTerm(api.term_data)
  const satisfies = api.satisfies
    ? api.satisfies
        .slice(0, 8)
        .map((r) => `${r.subjects[0]} ${r.course_number}`)
        .join(", ")
    : undefined

  return {
    courseReference: {
      subject: api.course_reference.subjects[0],
      courseNumber: api.course_reference.course_number,
    },
    courseTitle: api.course_title,
    description: api.description,
    prerequisites: api.prerequisites?.prerequisites_text,
    satisfies,
    credits: enrollment?.credit_count
      ? formatCreditCount(enrollment.credit_count)
      : "—",
    typicallyOffered: enrollment?.typically_offered ?? "—",
  }
}

export function mapApiStats(api: ApiCourse): CourseStats {
  const cumulative = api.cumulative_grade_data
  const latest = latestTermWithGrades(api.term_data)
  const totalGradedTerms = Object.values(api.term_data).filter(
    (t) => t.grade_data !== null,
  ).length

  return {
    termGPA: latest ? gpaFromGradeData(latest.data) : null,
    cumulativeGPA: cumulative ? gpaFromGradeData(cumulative) : null,
    termCompletionRate: latest ? completionRateFromGradeData(latest.data) : null,
    cumulativeCompletionRate: cumulative
      ? completionRateFromGradeData(cumulative)
      : null,
    termARate: latest ? aRateFromGradeData(latest.data) : null,
    cumulativeARate: cumulative ? aRateFromGradeData(cumulative) : null,
    termClassSize: latest ? latest.data.total : null,
    cumulativeAverageClassSize:
      cumulative && totalGradedTerms > 0
        ? cumulative.total / totalGradedTerms
        : null,
    gradeDistribution: cumulative
      ? gradeDistFromApi(cumulative)
      : { a: 0, ab: 0, b: 0, bc: 0, c: 0, d: 0, f: 0, other: 0 },
  }
}

