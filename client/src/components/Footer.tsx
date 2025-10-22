export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-white/80 dark:bg-emerald-950/80 backdrop-blur-md border-t border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
      <div className="container flex h-14 items-center justify-between">
        <p className="mx-6 text-sm text-emerald-700 dark:text-emerald-400">
          Built by <a href="https://pythagora.ai" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors underline">Pythagora</a>
        </p>
      </div>
    </footer>
  )
}