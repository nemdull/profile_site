import { useEffect, useMemo, useRef } from 'react'

import { READ_FROM, READ_TO } from '@/components/hero/stages'
import { profile } from '@/content'
import { INTRO_TONE } from '@/content/rooms'
import { prefersReducedMotion } from '@/lib/hooks'
import { clamp, onScrollFrame, trackProgress } from '@/lib/scroll'
import { segmentJa } from '@/lib/segment'

/**
 * 自己紹介の部屋。いちばん上の画面の奥にあって、最後の「。」の明かりが広がると見えてくる。
 * スクロールに合わせて、カーソルが文を先へ読み進める。まだ読んでいない所は薄く、読んだ所から濃くなる。
 * 「動きを減らす」設定のときは、はじめから全部読める。
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null)
  const paragraphs = useMemo(() => profile.meta.intro.map(segmentJa), [])

  useEffect(() => {
    const box = ref.current
    if (!box || prefersReducedMotion()) return
    const track = box.closest<HTMLElement>('.hero')
    const words = Array.from(box.querySelectorAll<HTMLElement>('.w'))
    const caret = box.querySelector<HTMLElement>('.caret')
    box.dataset.read = 'live'
    let shown = -1
    let layout = ''

    const stop = onScrollFrame((_, viewport) => {
      const rect = box.getBoundingClientRect()
      let progress: number
      if (track?.dataset.pin === 'true') {
        // 画面に留まっているあいだは、いちばん上の画面の進み具合に合わせて読む
        progress = clamp((trackProgress(track) - READ_FROM) / (READ_TO - READ_FROM))
      } else {
        // 留まっていないときは、文が画面の下のほうに見えたら読みはじめ、まん中より少し上まで来たら読み終える
        const from = viewport * 0.8
        const to = viewport * 0.44
        progress = clamp((from - rect.top) / Math.max(1, rect.height + from - to))
      }
      const count = Math.round(progress * words.length)
      const key = `${Math.round(rect.width)}:${Math.round(rect.height)}`
      if (count === shown && key === layout) return
      for (let index = Math.max(0, Math.min(shown, count)); index < Math.max(shown, count); index++) {
        words[index].dataset.on = String(index < count)
      }
      shown = count
      layout = key

      // カーソルを、いま読んだ語のすぐ後ろへ
      const word = words[Math.max(0, count - 1)]
      if (!caret || !word) return
      const lines = word.getClientRects()
      const line = count === 0 ? lines[0] : lines[lines.length - 1]
      if (!line) return
      caret.style.left = `${(count === 0 ? line.left : line.right) - rect.left}px`
      caret.style.top = `${line.top - rect.top}px`
      caret.style.height = `${line.height}px`
    })

    return () => {
      stop()
      delete box.dataset.read
    }
  }, [])

  return (
    <section id="intro" aria-labelledby="intro-title" className={`portal intro tone-${INTRO_TONE}`}>
      <h2 id="intro-title" className="sr-only">
        はじめまして
      </h2>
      <div ref={ref} className="intro-text">
        {paragraphs.map((words, row) => (
          <p key={row}>
            {words.map((word, index) => (
              <span key={index} className="w">
                {word}
              </span>
            ))}
          </p>
        ))}
        <span className="caret" aria-hidden="true" />
      </div>
    </section>
  )
}
