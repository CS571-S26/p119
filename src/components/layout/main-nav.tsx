import { Link, useLocation } from "react-router-dom"
import { navigation } from "@/lib/navigation"
import { siteConfig } from "@/lib/site-config"

export function MainNav() {
  const { pathname } = useLocation()
  const currentPath = pathname.toLowerCase()

  return (
    <div className="mr-4 hidden md:flex">
      <Link
        to="/"
        className="flex items-center text-lg font-semibold whitespace-nowrap md:text-lg"
      >
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="mx-6 flex items-center gap-6 text-sm">
        {navigation.map((item) => {
          const isActive = currentPath === item.href.toLowerCase()
          const className = `transition-colors ${
            isActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {item.title}
            </a>
          ) : (
            <Link key={item.href} to={item.href} className={className}>
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}