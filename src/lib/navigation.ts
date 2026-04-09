export interface NavItem {
  title: string
  href: string
  external?: boolean
}

export const navigation: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Course", href: "/course" },
  { title: "About", href: "/about" },
]