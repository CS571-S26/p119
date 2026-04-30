import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TopCourse {
  id: string
  label: string
  title: string
  total: number
}

interface PopularCoursesProps {
  limit?: number
}

function formatTotal(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function PopularCourses({ limit = 4 }: PopularCoursesProps) {
  const [courses, setCourses] = useState<TopCourse[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/top-courses.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`failed: ${r.status}`)
        return r.json() as Promise<TopCourse[]>
      })
      .then(setCourses)
      .catch((err) => {
        if (err.name === "AbortError") return
        setError("Could not load popular courses.")
      })
    return () => controller.abort()
  }, [])

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">{error}</p>
    )
  }

  const items = courses?.slice(0, limit) ?? null

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items
        ? items.map((c) => (
            <Link
              key={c.id}
              to={`/course/${c.id}`}
              className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-tight">{c.label}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="size-3" />
                  {formatTotal(c.total)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground group-hover:text-foreground">
                {c.title}
              </p>
            </Link>
          ))
        : Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
    </div>
  )
}
