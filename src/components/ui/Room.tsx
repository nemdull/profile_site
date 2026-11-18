import type { CSSProperties, ReactNode } from 'react'

import { toneAbove, toneOf } from '@/content/rooms'
import { useInView } from '@/lib/hooks'

type RoomProps = {
  id: string
  title: string
  lead?: ReactNode
  /** 見出しの下に置く、機械の札（点検の読み取り値など） */
  note?: ReactNode
  /** 見出しの横に並べるもの（説明と操作を左右に分けたいとき） */
  aside?: ReactNode
  /** 部屋のいちばん上に、画面の幅いっぱいで置くもの */
  banner?: ReactNode
  className?: string
  children?: ReactNode
}

// 見出しの文字が、起きる前に傾いている角度（度）と、ずり落ちている量（em）
const DROOP: readonly (readonly [number, number])[] = [
  [-7, 0.05],
  [5, 0.12],
  [-3, 0.02],
  [9, 0.16],
  [-5, 0.08],
  [4, 0.03],
  [-9, 0.14],
  [6, 0.06],
]

/**
 * 1 つの部屋（節）。地の色は部屋ごとに決まっていて、content/rooms.ts の並びどおりに切り替わる。
 * 見出しの文字は眠そうに傾いていて、初めて画面に入ったときに 1 回だけ、しゃんと起きる。
 */
export function Room({ id, title, lead, note, aside, banner, className = '', children }: RoomProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const tone = toneOf(id)
  const chars = Array.from(title)

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`room tone-${tone} ${className}`.trim()}
      data-room=""
      data-sky={tone === 'night' || undefined}
      data-tone={tone}
      data-inview={inView}
      style={{ '--above': `var(--color-${toneAbove(id)})` } as CSSProperties}
    >
      <div className="seam" aria-hidden="true" />
      {banner}
      <div className="page">
        <div className={aside ? 'room-head room-head-split' : 'room-head'}>
          <div className="room-head-main">
            <h2
              id={`${id}-title`}
              className="room-title"
              aria-label={title}
              style={{ '--n': chars.length } as CSSProperties}
            >
              {chars.map((char, index) => {
                const [rot, dy] = DROOP[index % DROOP.length]
                const style = { '--i': index, '--rot': `${rot}deg`, '--dy': `${dy}em` } as CSSProperties
                return (
                  <span key={index} className="ch" style={style} aria-hidden="true">
                    {char}
                  </span>
                )
              })}
            </h2>
            {lead ? <div className="room-lead">{lead}</div> : null}
            {note ? <div className="room-note">{note}</div> : null}
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  )
}
