import type { Course } from "@/lib/course-types"
import { formatCourseReference } from "@/lib/course-types"

interface CourseHeaderProps {
  course: Course
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {course.courseTitle}
        </h1>
        <div className="my-2 text-xl font-bold">
          {formatCourseReference(course.courseReference)}
        </div>
      </div>
    </div>
  )
}