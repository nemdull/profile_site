import { useEffect, useState, type CSSProperties, type RefObject } from 'react'

import { WARP_EVENT } from '@/lib/events'
import { prefersReducedMotion } from '@/lib/hooks'

// 眠そうに傾く角度（度）と、ずり落ちる量（em）。行ごと・文字ごとに少しずつ違えてある
const DROOP: readonly (readonly (readonly [number, number])[])[] = [
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

// スクロールしたとき、文字が飛んでいく高さ（画面の高さの何 %）と、回る角度（度）。文字ごとにばらばらにしてある
const FLIGHT: readonly (readonly (readonly [number, number])[])[] = [
  [
    [150, -14],
    [118, 9],
    [172, -6],
    [132, 22],
  ],
  [
    [112, 10],
    [146, -12],
    [98, 7],
    [124, -20],
  ],
  [
    [74, -8],
    [92, 6],
    [64, -5],
    [106, 9],
    [80, -7],
    [96, 5],
    [68, -9],
    [88, 6],
  ],
]

/** 「発進」の行が出るまでの時間（ミリ秒）。styles/motion.css の --ignite と合わせる */
const IGNITE_AT = 1700

type HeadlineProps = {
  lines: string[]
  /** 隕石で吹き飛ばされているとき true。h1 を本当に空にする（点検が落ちるように） */
  broken: boolean
  /** 最後の「。」の中の明かり。スクロールすると、ここから次の部屋の色が広がる */
  lampRef: RefObject<HTMLSpanElement | null>
}

/**
 * いちばん大きい見出し。
 * はじめの 2 行は眠そうに垂れて出てきて、3 行目が出る瞬間に全員まっすぐになる。
 * 「。」は字ではなく輪で描いていて、最後の 1 つだけ明かりが点く。
 */
export function Headline({ lines, broken, lampRef }: HeadlineProps) {
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

  const last = lines.length - 1
  const text = lines.map((line, row) => {
    const chars = Array.from(line)
    return (
      <span key={row} className={row < last ? 'line line-sleepy' : 'line line-go'} style={{ '--row': row } as CSSProperties}>
        {chars.map((char, index) => {
          const [rot, dy] = DROOP[row]?.[index] ?? [0, 0]
          const lamp = row === last && index === chars.length - 1 && char === '。'
          // 明かりの点く「。」だけは飛ばさない（そこから次の部屋が広がるので、動くと辻褄が合わなくなる）
          const [lift, spin] = lamp ? [0, 0] : (FLIGHT[row]?.[index] ?? [90, 0])
          const flight = { '--lift': lift, '--spin': `${spin}deg` } as CSSProperties
          const pose = { '--i': index, '--rot': `${rot}deg`, '--dy': `${dy}em` } as CSSProperties
          return (
            <span key={index} className="fly" style={flight}>
              {char === '。' ? (
                <span className="ch maru" style={pose} data-lamp={lamp || undefined}>
                  <span className="maru-glyph">{char}</span>
                  {lamp ? <span ref={lampRef} className="maru-core" /> : null}
                </span>
              ) : (
                <span className="ch" style={pose}>
                  {char}
                </span>
              )}
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
