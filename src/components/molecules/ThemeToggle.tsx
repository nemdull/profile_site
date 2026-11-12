import { useState } from 'react'

type Theme = 'light' | 'dark'

const currentTheme = (): Theme => {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // 保存できない環境でも、表示はその場で切り替わる
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? '明るい表示にする' : '暗い表示にする'}
      className="grid h-9 w-9 place-items-center rounded-full border border-rule text-soft transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        {theme === 'dark' ? (
          <>
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.8v2.2M10 16v2.2M1.8 10h2.2M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6" />
          </>
        ) : (
          <path d="M16.6 11.9A7 7 0 0 1 8.1 3.4a7 7 0 1 0 8.5 8.5Z" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}
