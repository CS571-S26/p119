import { Link } from "react-router-dom"
import { Network, Search, Sparkles, TrendingUp } from "lucide-react"
import { ContentWrapper } from "@/components/content-wrapper"
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Announcement } from "@/components/announcement"
import { PopularCourses } from "@/components/popular-courses"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Search,
    title: "Search any course",
    description:
      "Press ⌘K from anywhere to search 8,000+ courses, instructors, and subjects with fuzzy matching.",
  },
  {
    icon: Network,
    title: "Prerequisite graphs",
    description:
      "See how courses connect within a subject. Click any node to jump in and trace dependencies.",
  },
  {
    icon: TrendingUp,
    title: "Real grade data",
    description:
      "Every course shows actual term and cumulative grade distributions sourced from Madgrades.",
  },
]

export function HomePage() {
  return (
    <div className="w-full">
      <ContentWrapper className="w-full">
        <section className="relative bg-white dark:bg-transparent">
          <div className="absolute inset-0 isolate z-[2] hidden opacity-50 lg:block">
            <div className="absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21.875rem] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
            <div className="absolute top-0 left-0 h-[80rem] w-[15rem] translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            <div className="absolute top-0 left-0 h-[80rem] w-[15rem] -translate-y-[21.875rem] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          </div>
          <div className="relative mx-auto max-w-5xl px-6 py-24 lg:py-32">
            <div className="relative z-10 mx-auto text-center">
              <Announcement />
              <PageHeaderHeading>{siteConfig.name}</PageHeaderHeading>
              <PageHeaderDescription>
                {siteConfig.description}
              </PageHeaderDescription>
              <p className="text-primary mt-3 text-center text-sm">
                {siteConfig.disclaimer}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/course/COMPSCI_300"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  <Sparkles className="size-4" />
                  Try a course
                </Link>
                <Link
                  to="/about"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Most-taken courses
            </h2>
            <p className="text-sm text-muted-foreground">
              By cumulative enrollment
            </p>
          </div>
          <PopularCourses limit={4} />
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            What you can do
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-card p-5"
              >
                <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ContentWrapper>
    </div>
  )
}
