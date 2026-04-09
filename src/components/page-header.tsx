import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function PageHeaderHeading({
  className,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-center text-4xl leading-tight font-bold tracking-tighter md:text-6xl lg:text-6xl",
        className
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-muted-foreground mx-auto max-w-[750px] text-center text-lg text-balance sm:text-xl",
        className
      )}
      {...props}
    />
  )
}
