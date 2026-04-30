import { MainNav } from "@/components/layout/main-nav"
import { GithubIcon } from "@/components/icons/github"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SearchTrigger } from "@/components/search/search-trigger"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function Navbar() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="md:ml-auto md:w-fit">
              <SearchTrigger />
            </div>
          </div>
          <nav className="flex items-center">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "h-8 w-8 px-0"
              )}
            >
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}