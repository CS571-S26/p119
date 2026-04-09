export const siteConfig = {
  name: "UW Course Explorer",
  description: "Just a quick recreation.",
  disclaimer:
    "Not affiliated with the University of Wisconsin-Madison.",
  links: {
    github: "https://github.com/CS571-S26/p119",
  },
} as const

export type SiteConfig = typeof siteConfig