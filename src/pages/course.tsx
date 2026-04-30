import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { ContentWrapper } from "@/components/content-wrapper"
import { CourseHeader } from "@/components/course/course-header"
import { CourseTabs } from "@/components/course/course-tabs"
import { SubjectGraph } from "@/components/graph/subject-graph"
import {
  SAMPLE_COURSE,
  SAMPLE_STATS,
  mapApiCourse,
  mapApiStats,
  type Course,
  type CourseStats,
} from "@/lib/course-types"
import { getCourse, type ApiCourse } from "@/lib/api"

declare global {
  interface Window {
    __INITIAL_COURSE_DATA__?: { id: string; course: ApiCourse }
  }
}

function getInitialApiCourse(courseId: string | undefined): ApiCourse | null {
  if (!courseId || typeof window === "undefined") return null
  const data = window.__INITIAL_COURSE_DATA__
  if (!data || data.id !== courseId) return null
  return data.course
}

export function CoursePage() {
  const { courseId } = useParams<{ courseId?: string }>()
  return <CoursePageInner key={courseId ?? "__default__"} courseId={courseId} />
}

function CoursePageInner({ courseId }: { courseId?: string }) {
  const initial = getInitialApiCourse(courseId)

  const [course, setCourse] = useState<Course | null>(() => {
    if (!courseId) return SAMPLE_COURSE
    if (initial) return mapApiCourse(initial)
    return null
  })
  const [stats, setStats] = useState<CourseStats | null>(() => {
    if (!courseId) return SAMPLE_STATS
    if (initial) return mapApiStats(initial)
    return null
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId || initial) return

    const controller = new AbortController()

    getCourse(courseId, controller.signal)
      .then((data) => {
        setCourse(mapApiCourse(data))
        setStats(mapApiStats(data))
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setError("Could not load course.")
      })

    return () => controller.abort()
  }, [courseId, initial])

  if (error) {
    return (
      <ContentWrapper className="w-full">
        <div className="py-16 text-center text-sm text-destructive">
          {error}
        </div>
      </ContentWrapper>
    )
  }

  if (!course || !stats) {
    return (
      <ContentWrapper className="w-full">
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading course...
        </div>
      </ContentWrapper>
    )
  }

  const subject = course.courseReference.subject

  return (
    <ContentWrapper className="w-full">
      <CourseHeader course={course} />
      <CourseTabs course={course} stats={stats} />
      {courseId && subject && (
        <section className="mt-8 space-y-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Subject Graph</h2>
            <p className="text-sm text-muted-foreground">
              Prerequisite map for {subject}. The current course is highlighted.
            </p>
          </div>
          <SubjectGraph subject={subject} activeCourseId={courseId} />
        </section>
      )}
    </ContentWrapper>
  )
}
