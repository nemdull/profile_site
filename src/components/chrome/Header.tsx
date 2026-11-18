import { useCallback, useEffect, useRef, useState } from 'react'

import { DARK_TONES, type Tone } from '@/content/rooms'
import { prefersReducedMotion } from '@/lib/hooks'
import { onScrollFrame, trackProgress } from '@/lib/scroll'
import { CHECKS } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

import { IndexOverlay } from './IndexOverlay'

/** 上の帯の、高さの真ん中あたり（px）。ここにある部屋を「いまいる部屋」とする */
const PROBE = 40

// 「いまここ」が切り替わるとき、決まるまでのあいだ出しておく記号
const NOISE = '#/_-+*=<>'

/** 上の帯の「いまここ」（#works など）。部屋が変わると、記号がぱらぱらと入れ替わってから、新しい名前に決まる */
function Crumb({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion()) {
      node.textContent = text
      return
    }
    const started = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - started) / 320)
      const settled = Math.floor(progress * text.length)
      const rest = Array.from(text.slice(settled), () => NOISE[Math.floor(Math.random() * NOISE.length)])
      node.textContent = text.slice(0, settled) + rest.join('')
      if (progress < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [text])

  // 中の字は上の処理が直接書く（飾りなので、読み上げには出さない）
  return <span ref={ref} className="hud-crumb" aria-hidden="true" />
}

/**
 * 画面の上に付いてくる帯。左は名前といまいる部屋、右は点検のランプと目次。
 * 下の部屋の色に合わせて、島の色が入れ替わる（暗い部屋の上では白、明るい部屋の上では紺）。
 */
export function Header() {
  const { phase, passed, failed } = usePreflight()
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(
    () =>
      onScrollFrame(() => {
        const header = ref.current
        if (!header) return
        let id = 'top'
        let tone: Tone = 'night'
        for (const room of document.querySelectorAll<HTMLElement>('[data-room]')) {
          const rect = room.getBoundingClientRect()
          if (rect.top > PROBE || rect.bottom <= PROBE) continue
          id = room.dataset.room || room.id
          tone = (room.dataset.tone as Tone | undefined) ?? tone
          // いちばん上の画面は、スクロールの途中で、奥にある自己紹介の部屋に切り替わる
          const late = room.dataset.lateRoom
          if (late && room.dataset.pin === 'true' && trackProgress(room) >= Number(room.dataset.lateAt ?? 1)) {
            id = late
            tone = (room.dataset.lateTone as Tone | undefined) ?? tone
          }
          break
        }
        header.dataset.scheme = DARK_TONES.includes(tone) ? 'on-dark' : 'on-light'
        setActive(id)
      }),
    [],
  )

  const close = useCallback(() => setOpen(false), [])

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
    <>
      <header ref={ref} className="hud" data-scheme="on-dark">
        <div className="hud-row">
          <p className="hud-island hud-home">
            <a href="#top" className="hud-name">
              nemdull
            </a>
            <Crumb text={`#${active}`} />
          </p>
          <div className="hud-side">
            <a href="#preflight" className="hud-island chip" data-state={state}>
              <span className="lamp" aria-hidden="true" />
              {status}
            </a>
            <button
              type="button"
              className="hud-island hud-menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <span className="hud-menu-label">目次</span>
              <span className="hud-menu-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {open ? <IndexOverlay active={active === 'intro' ? 'top' : active} onClose={close} /> : null}
    </>
  )
}
