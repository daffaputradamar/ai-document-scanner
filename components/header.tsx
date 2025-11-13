'use client'

import { useTheme } from 'next-themes'
import { ScanText, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex items-center justify-between gap-3 mb-8 pb-6 border-b border-border">
      <div className="flex items-center gap-3">
        <ScanText className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">AI Document Scanner</h1>
      </div>
      
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-secondary dark:bg-secondary text-foreground hover:bg-accent dark:hover:bg-accent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      )}
    </header>
  )
}
