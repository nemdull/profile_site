import { useEffect, useState, type CSSProperties } from 'react'

import { WARP_EVENT } from '@/lib/events'
import { prefersReducedMotion } from '@/lib/hooks'

// 眠そうに傾く角度（度）と、ずり落ちる量（em）。行ごと・文字ごとに少しずつ違えてある
const DROOP = [
  [
    [-3, 0],
    [5, 0.04],
    [10, 0.09],
    [16, 0.16],
  ],
  [
    [-6, 0.03],
    [7, 0.08],
    [14, 0.15],
    [22, 0.25],
  ],
]

/** 「発進」の行が出るまでの時間（ミリ秒）。index.css の --ignite と合わせる */
const IGNITE_AT = 1900

type HeadlineProps = {
  lines: string[]
  /** 隕石で吹き飛ばされているとき true。h1 を本当に空にする（点検が落ちるように） */
  broken: boolean
}

/**
 * いちばん大きい見出し。
 * はじめの 2 行は眠そうに垂れて出てきて、3 行目が出る瞬間に全員まっすぐになる。
 */
export function Headline({ lines, broken }: HeadlineProps) {
  // 一度壊れたあとの復旧では、眠そうな登場をやり直さず、さっと戻す
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    if (broken) setRestored(true)
  }, [broken])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const timer = window.setTimeout(() => window.dispatchEvent(new Event(WARP_EVENT)), IGNITE_AT)
    return () => window.clearTimeout(timer)
  }, [])

  const text = lines.map((line, row) => {
    const sleepy = row < lines.length - 1
    return (
      <span key={row} className={sleepy ? 'line line-sleepy' : 'line line-go'} style={{ '--row': row } as CSSProperties}>
        {Array.from(line).map((char, index) => {
          const [rot, dy] = DROOP[row]?.[index] ?? [0, 0]
          const style = { '--i': index, '--rot': `${rot}deg`, '--dy': `${dy}em` } as CSSProperties
          return (
            <span key={index} className="ch" style={style}>
              {char}
            </span>
          )
        })}
      </span>
    )
  })

  if (broken) {
    return (
      <div className="headline-box" data-broken="true">
        <h1 className="headline headline-empty" />
        <div className="headline headline-debris" aria-hidden="true">
          {text}
        </div>
        <p className="fault-note">見出しが吹き飛びました</p>
      </div>
    )
  }

  return (
    <div className="headline-box">
      <h1 className={restored ? 'headline headline-restore' : 'headline headline-intro'} aria-label={lines.join('')}>
        <span aria-hidden="true">{text}</span>
      </h1>
    </div>
  )
}
