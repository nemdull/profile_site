import type { CSSProperties } from 'react'

type CheckMarkProps = {
  /** 何番目の行か。読み込み時に、上から順にチェックが付く */
  index: number
}

export function CheckMark({ index }: CheckMarkProps) {
  return (
    <svg viewBox="0 0 20 20" className="spec-check" style={{ '--i': index } as CSSProperties} aria-hidden="true">
      <circle cx="10" cy="10" r="10" />
      <path d="M5.8 10.4 8.7 13.2 14.4 7.2" />
    </svg>
  )
}
