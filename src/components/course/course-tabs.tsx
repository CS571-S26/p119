import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseDetails } from "@/components/course/course-details"
import { CourseOverview } from "@/components/course/tabs/course-overview"
import type { Course, CourseStats } from "@/lib/course-types"

interface CourseTabsProps {
  course: Course
  stats: CourseStats
}

export function CourseTabs({ course, stats }: CourseTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="my-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      <div className="grid gap-4 lg:grid-cols-12">
        <CourseDetails course={course} />
        <TabsContent className="space-y-4 lg:col-span-9" value="overview">
          <CourseOverview stats={stats} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
