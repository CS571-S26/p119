import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function ContentWrapper({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("container mx-auto px-6 py-8 md:px-8", className)}
      {...props}
    />
  )
}
