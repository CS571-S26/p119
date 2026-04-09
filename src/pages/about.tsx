import { ContentWrapper } from "@/components/content-wrapper"
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export function AboutPage() {
  return (
    <ContentWrapper className="w-full">
      <div className="mx-auto max-w-3xl space-y-10 py-12">
        <div className="space-y-4">
          <PageHeaderHeading>About</PageHeaderHeading>
          <PageHeaderDescription>
            We are still in progress!
          </PageHeaderDescription>
        </div>
      </div>
    </ContentWrapper>
  )
}
