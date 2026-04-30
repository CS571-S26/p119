import { ExternalLink } from "lucide-react"
import { ContentWrapper } from "@/components/content-wrapper"
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

const stack = [
  { name: "Vite", href: "https://vite.dev" },
  { name: "React 19", href: "https://react.dev" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "React Router", href: "https://reactrouter.com" },
  { name: "Tailwind CSS v4", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
  { name: "React Flow", href: "https://reactflow.dev" },
  { name: "dagre", href: "https://github.com/dagrejs/dagre" },
  { name: "Recharts", href: "https://recharts.org" },
]

export function AboutPage() {
  return (
    <ContentWrapper className="w-full">
      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
        <div className="space-y-4">
          <PageHeaderHeading>About</PageHeaderHeading>
          <PageHeaderDescription>
            MadMap is an interactive prerequisite map for UW–Madison courses.
          </PageHeaderDescription>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">Why</h2>
          <p className="text-muted-foreground leading-relaxed">
            UW–Madison has over 8,000 courses across 190+ subjects. The
            official course catalog is hard to navigate — you can read one
            course at a time, but you can&apos;t see how courses connect. MadMap
            visualizes those relationships and pulls course details, real
            grade distributions, and prerequisite chains into one place.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">How to use it</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <span className="text-foreground">Search.</span> Press{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                ⌘K
              </kbd>{" "}
              (or click the search bar) to fuzzy-find any course, instructor,
              or subject.
            </li>
            <li>
              <span className="text-foreground">Open a course.</span> Click any
              search result to see its description, prerequisites, satisfaction
              chains, and term-by-term grade distribution.
            </li>
            <li>
              <span className="text-foreground">Explore the graph.</span> Each
              course page renders the full subject prerequisite graph. Hover a
              node to fade unrelated courses; click to navigate.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            Course data, prerequisite graphs, and grade distributions are
            sourced from the public{" "}
            <a
              href="https://uwcourses.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              uwcourses.com
            </a>{" "}
            API, which scrapes the UW course catalog and Madgrades. Course
            detail pages are pre-rendered at build time and hydrated with the
            relevant course payload so deep links load instantly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">Tech</h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.name}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight">Project</h2>
          <p className="text-muted-foreground leading-relaxed">
            Built by James Ding for{" "}
            <span className="text-foreground">CS571: Building User Interfaces</span>{" "}
            (UW–Madison, Spring 2026). Source on{" "}
            <a
              href="https://github.com/CS571-S26/p119"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              GitHub
            </a>
            . Not affiliated with the University of Wisconsin–Madison.
          </p>
        </section>
      </div>
    </ContentWrapper>
  )
}
