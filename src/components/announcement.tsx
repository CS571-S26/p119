import { Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AnnouncementProps {
  className?: string
}

export function Announcement({ className }: AnnouncementProps) {
  return (
    <a
      href="https://github.com/twangodev/uw-coursemap"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "bg-muted mb-4 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium",
        className
      )}
    >
      <Star className="size-4" />
      <Separator className="mx-2 h-4" orientation="vertical" />
      <span>This website is still in progress</span>
    </a>
  )
}