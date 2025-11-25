export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-foreground/70">
            © {currentYear} OmegaTools. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/omegatools"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 transition-colors hover:text-foreground"
            aria-label="Twitter"
          >
            <svg
              className="h-4 w-4 text-foreground/70 transition-colors group-hover:text-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="hidden text-xs text-foreground/70 transition-colors group-hover:text-foreground sm:inline">
              Twitter
            </span>
          </a>

          <a
            href="https://t.me/TradeonOmegaBot"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 transition-colors hover:text-foreground"
            aria-label="Telegram"
          >
            <svg
              className="h-4 w-4 text-foreground/70 transition-colors group-hover:text-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span className="hidden text-xs text-foreground/70 transition-colors group-hover:text-foreground sm:inline">
              Telegram
            </span>
          </a>

          <a
            href="https://docs.omegatools.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 transition-colors hover:text-foreground"
            aria-label="Documentation"
          >
            <svg
              className="h-4 w-4 text-foreground/70 transition-colors group-hover:text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="hidden text-xs text-foreground/70 transition-colors group-hover:text-foreground sm:inline">
              Docs
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
