import { useEffect, useState } from 'react'

import { CHECKS } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

const NAV = [
  { href: '#claims', label: 'できること' },
  { href: '#experience', label: '仕事' },
  { href: '#works', label: 'つくったもの' },
  { href: '#writing', label: '書いたもの' },
  { href: '#skills', label: '道具' },
  { href: '#certifications', label: '資格' },
  { href: '#contact', label: '連絡' },
]

/** 画面の上に付いてくる帯。右端のランプは、点検の結果をそのまま映している */
export function Hud() {
  const { phase, passed, failed } = usePreflight()
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const root = document.documentElement
      const reach = root.scrollHeight - window.innerHeight
      root.style.setProperty('--scroll', String(reach > 0 ? Math.min(1, window.scrollY / reach) : 0))
      setSolid(window.scrollY > 24)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const state = failed > 0 ? 'fail' : phase === 'done' ? 'pass' : phase
  const status =
    failed > 0
      ? `異常 ${failed} 件`
      : phase === 'done'
        ? `点検 ${passed}/${CHECKS.length} 合格`
        : phase === 'running'
          ? `点検中 ${passed}/${CHECKS.length}`
          : '点検 待機中'

  return (
    <header className="hud" data-solid={solid}>
      <div className="page hud-inner">
        <a href="#top" className="hud-name">
          nemdull
        </a>
        <nav aria-label="ページ内の移動" className="hud-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#preflight" className="chip" data-state={state}>
          <span className="lamp" aria-hidden="true" />
          {status}
        </a>
      </div>
      <span className="hud-progress" aria-hidden="true" />
    </header>
  )
}
