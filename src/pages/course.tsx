import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { ContentWrapper } from "@/components/content-wrapper"
import { CourseHeader } from "@/components/course/course-header"
import { CourseTabs } from "@/components/course/course-tabs"
import {
  SAMPLE_COURSE,
  SAMPLE_STATS,
  mapApiCourse,
  mapApiStats,
  type Course,
  type CourseStats,
} from "@/lib/course-types"
import { getCourse } from "@/lib/api"

export function CoursePage() {
  const { courseId } = useParams<{ courseId?: string }>()
  const [course, setCourse] = useState<Course | null>(
    courseId ? null : SAMPLE_COURSE,
  )
  const [stats, setStats] = useState<CourseStats | null>(
    courseId ? null : SAMPLE_STATS,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

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
  }, [courseId])

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

  return (
    <ContentWrapper className="w-full">
      <CourseHeader course={course} />
      <CourseTabs course={course} stats={stats} />
    </ContentWrapper>
  )
}
