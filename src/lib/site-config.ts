export const siteConfig = {
  name: "MadMap",
  description: "An interactive prerequisite map for UW–Madison courses.",
  disclaimer:
    "Not affiliated with the University of Wisconsin-Madison.",
  links: {
    github: "https://github.com/CS571-S26/p119",
  },
} as const

export type SiteConfig = typeof siteConfig