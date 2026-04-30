export function Footer() {
  return (
    <footer className="bg-background border-border/40 dark:border-border flex border-t py-6 md:px-8 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row">
        <div className="text-muted-foreground flex flex-col gap-1 text-center text-sm leading-loose text-balance md:text-left">
          <p>
            Built by{" "}
            <a
              href="https://twango.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              James Ding
            </a>{" "}
          </p>
        </div>
      </div>
    </footer>
  )
}
