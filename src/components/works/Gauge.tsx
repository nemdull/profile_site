import { useEffect, useRef, useState } from 'react'

import { profile } from '@/content'
import { useInView, useReducedMotion } from '@/lib/hooks'

const RADIUS = 100
const ARC = Math.PI * RADIUS

/** 数字を、いまの値から目標までなめらかに動かす */
function useCountTo(target: number, still: boolean) {
  const [value, setValue] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (still) {
      current.current = target
      setValue(target)
      return
    }
    const from = current.current
    const started = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - started) / 800)
      const eased = 1 - (1 - t) ** 3
      current.current = from + (target - from) * eased
      setValue(Math.round(current.current))
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [target, still])

  return value
}

/**
 * sf-meter のメーター。API の初期データから数件を借りて、針を動かしてみせる。
 * 触るまでは数秒おきに次の項目へ進み、触ったら止まる。
 */
export function Gauge() {
  const { meter } = profile.works
  const [selected, setSelected] = useState(0)
  const [touched, setTouched] = useState(false)
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -20% 0px')
  const still = useReducedMotion()

  useEffect(() => {
    if (!inView || touched || still) return
    const timer = window.setInterval(() => setSelected((index) => (index + 1) % meter.items.length), 2800)
    return () => window.clearInterval(timer)
  }, [inView, touched, still, meter.items.length])

  const item = meter.items[selected]
  const score = inView ? item.score : 0
  const shown = useCountTo(score, still)

  return (
    <div ref={ref} className="gauge">
      <div className="gauge-dial">
        <svg viewBox="0 0 240 142" role="img" aria-label={`${item.name}の${meter.unit}は ${item.score}`}>
          <defs>
            <linearGradient id="gauge-scale" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--color-alert)" />
              <stop offset="0.5" stopColor="var(--color-sun)" />
              <stop offset="1" stopColor="var(--color-go)" />
            </linearGradient>
          </defs>
          <path className="gauge-track" d="M20 130 A100 100 0 0 1 220 130" />
          <path
            className="gauge-value"
            d="M20 130 A100 100 0 0 1 220 130"
            stroke="url(#gauge-scale)"
            strokeDasharray={`${(score / 100) * ARC} ${ARC}`}
          />
          {Array.from({ length: 11 }, (_, tick) => (
            <line
              key={tick}
              className="gauge-tick"
              x1="120"
              y1="42"
              x2="120"
              y2={tick % 5 === 0 ? 54 : 49}
              transform={`rotate(${-90 + tick * 18} 120 130)`}
            />
          ))}
          <g className="gauge-needle" style={{ transform: `rotate(${-90 + score * 1.8}deg)` }}>
            <line x1="120" y1="130" x2="120" y2="48" />
            <circle cx="120" cy="130" r="7" />
          </g>
        </svg>
        <p className="gauge-ends" aria-hidden="true">
          <span>{meter.low}</span>
          <span>{meter.high}</span>
        </p>
      </div>
      <p className="gauge-readout" aria-hidden="true">
        <span className="gauge-name">{item.name}</span>
        <span className="gauge-score">
          <small>{meter.unit}</small>
          {shown}
        </span>
      </p>
      <ul className="gauge-picker">
        {meter.items.map((entry, index) => (
          <li key={entry.name}>
            <button
              type="button"
              aria-pressed={index === selected}
              onClick={() => {
                setTouched(true)
                setSelected(index)
              }}
            >
              {entry.name}
            </button>
          </li>
        ))}
      </ul>
      <p className="gauge-caption">{meter.caption}</p>
    </div>
  )
}
