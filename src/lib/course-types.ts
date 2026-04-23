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

export const SAMPLE_COURSE: Course = {
  courseReference: { subject: "COMP SCI", courseNumber: 300 },
  courseTitle: "Programming II",
  description:
    "Introduction to Object-Oriented programming with the use of a programming language such as Java. Programming skills include: problem abstraction and decomposition, the software life cycle, the use and implementation of classes, objects and common data structures, file I/O, a brief introduction to algorithm analysis, GUI programming, and exception handling.",
  prerequisites: "COMP SCI 200, 220, or placement into COMP SCI 300",
  satisfies:
    "Required for COMP SCI major; prerequisite for COMP SCI 400, 354, etc.",
  credits: "3",
  typicallyOffered: "Fall, Spring, Summer",
}

export const SAMPLE_STATS: CourseStats = {
  termGPA: 3.42,
  cumulativeGPA: 3.31,
  termCompletionRate: 96.2,
  cumulativeCompletionRate: 94.8,
  termARate: 52.1,
  cumulativeARate: 48.6,
  termClassSize: 312,
  cumulativeAverageClassSize: 288,
  gradeDistribution: {
    a: 1842,
    ab: 684,
    b: 512,
    bc: 231,
    c: 168,
    d: 64,
    f: 41,
    other: 92,
  },
}