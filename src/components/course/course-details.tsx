import { BookOpen, CalendarRange, ClipboardCheck, Info } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Course } from "@/lib/course-types"

interface CourseDetailsProps {
  course: Course
}

export function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div className="mt-2 lg:col-span-3 lg:relative">
      <Card className="lg:absolute lg:inset-0 lg:overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Course Description
          </CardTitle>
          <Info className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <p className="text-sm break-words">{course.description}</p>
        </CardContent>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Prerequisites</CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <p className="text-sm break-words">
            {course.prerequisites ?? "None"}
          </p>
        </CardContent>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Satisfies</CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <p className="text-sm break-words">{course.satisfies ?? "—"}</p>
        </CardContent>

        <div className="flex flex-row space-x-4">
          <div className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Credits</CardTitle>
              <ClipboardCheck className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-sm break-words">{course.credits}</p>
            </CardContent>
          </div>
          <div className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Offered</CardTitle>
              <CalendarRange className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-sm break-words">{course.typicallyOffered}</p>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}
