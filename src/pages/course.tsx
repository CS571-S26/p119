import { ContentWrapper } from "@/components/content-wrapper"
import { CourseHeader } from "@/components/course/course-header"
import { CourseTabs } from "@/components/course/course-tabs"
import { SAMPLE_COURSE, SAMPLE_STATS } from "@/lib/course-types"

export function CoursePage() {
  const course = SAMPLE_COURSE
  const stats = SAMPLE_STATS

  return (
    <ContentWrapper className="w-full">
      <CourseHeader course={course} />
      <CourseTabs course={course} stats={stats} />
    </ContentWrapper>
  )
}
