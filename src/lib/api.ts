const SEARCH_API_URL =
  import.meta.env.VITE_SEARCH_API_URL ?? "https://search.uwcourses.com"

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
