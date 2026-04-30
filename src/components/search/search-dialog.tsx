import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, GraduationCap, Layers, Loader2 } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { searchAll, type SearchResponse } from "@/lib/api"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 200)
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [resultsForQuery, setResultsForQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  const trimmed = debouncedQuery.trim()
  const loading = !!trimmed && resultsForQuery !== trimmed && !error

  useEffect(() => {
    if (!trimmed) return

    const controller = new AbortController()

    searchAll(trimmed, controller.signal)
      .then((data) => {
        setResults(data)
        setResultsForQuery(trimmed)
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setError("Search failed. Try again.")
      })

    return () => controller.abort()
  }, [trimmed])

  function handleQueryChange(value: string) {
    setQuery(value)
    setError(null)
    if (!value.trim()) {
      setResults(null)
      setResultsForQuery("")
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      setQuery("")
      setResults(null)
      setResultsForQuery("")
      setError(null)
    }
  }

  const hasAnyResults =
    results &&
    (results.courses.length > 0 ||
      results.instructors.length > 0 ||
      results.subjects.length > 0)

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search MadMap"
      description="Find courses, instructors, and subjects."
    >
      <CommandInput
        value={query}
        onValueChange={handleQueryChange}
        placeholder="Search courses, instructors, subjects..."
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Searching...
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && !query.trim() && (
          <CommandEmpty>Start typing to search.</CommandEmpty>
        )}

        {!loading && !error && query.trim() && !hasAnyResults && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {results && results.courses.length > 0 && (
          <CommandGroup heading="Courses">
            {results.courses.map((c) => (
              <CommandItem
                key={c.course_id}
                value={`course-${c.course_id}`}
                onSelect={() => {
                  navigate(`/course/${c.course_id}`)
                  handleOpenChange(false)
                }}
              >
                <BookOpen />
                <span className="font-medium">
                  {c.subjects[0]} {c.course_number}
                </span>
                <span className="text-muted-foreground truncate">
                  {c.course_title}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results &&
          results.courses.length > 0 &&
          (results.subjects.length > 0 || results.instructors.length > 0) && (
            <CommandSeparator />
          )}

        {results && results.subjects.length > 0 && (
          <CommandGroup heading="Subjects">
            {results.subjects.map((s) => (
              <CommandItem
                key={s.subject_id}
                value={`subject-${s.subject_id}`}
                onSelect={() => onOpenChange(false)}
              >
                <Layers />
                <span className="font-medium">{s.subject_id}</span>
                <span className="text-muted-foreground truncate">{s.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results &&
          results.subjects.length > 0 &&
          results.instructors.length > 0 && <CommandSeparator />}

        {results && results.instructors.length > 0 && (
          <CommandGroup heading="Instructors">
            {results.instructors.map((i) => (
              <CommandItem
                key={i.instructor_id}
                value={`instructor-${i.instructor_id}`}
                onSelect={() => onOpenChange(false)}
              >
                <GraduationCap />
                <span className="font-medium">{i.name}</span>
                {i.department && (
                  <span className="text-muted-foreground truncate">
                    {i.department}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
