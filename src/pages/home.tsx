import { Link } from "react-router-dom"
import { ContentWrapper } from "@/components/content-wrapper"
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Announcement } from "@/components/announcement"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function HomePage() {
  return (
    <div className="w-full">
      <ContentWrapper className="w-full">
        <div className="absolute inset-0 isolate z-[2] hidden opacity-50 lg:block">
          <div className="absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21.875rem] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute top-0 left-0 h-[80rem] w-[15rem] translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          <div className="absolute top-0 left-0 h-[80rem] w-[15rem] -translate-y-[21.875rem] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section className="bg-white dark:bg-transparent">
          <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
            <div className="relative z-10 mx-auto text-center">
              <Announcement />
              <PageHeaderHeading>{siteConfig.name}</PageHeaderHeading>
              <PageHeaderDescription>
                {siteConfig.description}
              </PageHeaderDescription>
              <p className="text-primary mt-3 text-center text-sm">
                {siteConfig.disclaimer}
              </p>
              <div className="py-4 md:pb-10">
                <Link
                  to="/about"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ContentWrapper>
    </div>
  )
}
