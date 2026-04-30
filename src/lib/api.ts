const SEARCH_API_URL =
  import.meta.env.VITE_SEARCH_API_URL ?? "https://search.uwcourses.com"

const STATIC_API_URL =
  import.meta.env.VITE_STATIC_API_URL ?? "https://static.uwcourses.com"

export interface CourseHit {
  course_id: string
  course_title: string
  course_number: number
  subjects: string[]
  departments: string[]
  score: number
}

export interface InstructorHit {
  instructor_id: string
  name: string
  official_name: string
  email: string
  position: string
  department: string
  score: number
}

export interface SubjectHit {
  subject_id: string
  name: string
  score: number
}

export interface SearchResponse {
  courses: CourseHit[]
  instructors: InstructorHit[]
  subjects: SubjectHit[]
}

export async function searchAll(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const res = await fetch(`${SEARCH_API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal,
  })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}

export interface ApiCourseReference {
  course_number: number
  subjects: string[]
}

export interface ApiGradeData {
  a: number
  ab: number
  b: number
  bc: number
  c: number
  d: number
  f: number
  credit: number
  incomplete: number
  no_credit: number
  no_work: number
  not_reported: number
  other: number
  passed: number
  satisfactory: number
  unsatisfactory: number
  total: number
  instructors?: string[] | null
}

export interface ApiEnrollmentData {
  credit_count?: [number, number]
  typically_offered?: string
  general_education?: boolean
  ethnics_studies?: boolean
  last_taught_term?: string
}

export interface ApiTermData {
  enrollment_data: ApiEnrollmentData | null
  grade_data: ApiGradeData | null
}

export interface ApiCourse {
  course_reference: ApiCourseReference
  course_title: string
  description: string
  cumulative_grade_data: ApiGradeData | null
  prerequisites: {
    prerequisites_text?: string
  } | null
  satisfies?: ApiCourseReference[]
  term_data: Record<string, ApiTermData>
}

export async function getCourse(
  courseId: string,
  signal?: AbortSignal,
): Promise<ApiCourse> {
  const res = await fetch(`${STATIC_API_URL}/course/${courseId}.json`, {
    signal,
  })
  if (!res.ok) throw new Error(`Course fetch failed: ${res.status}`)
  return res.json()
}
