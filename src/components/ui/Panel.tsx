import type { PointerEvent, ReactNode } from 'react'

type PanelProps = {
  className?: string
  children: ReactNode
}

/** 「つくったもの」の 1 枚。ポインターの位置に、うっすら明かりが付いてくる */
export function Panel({ className = '', children }: PanelProps) {
  const follow = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`)
  }

  return (
    <article className={`panel ${className}`} onPointerMove={follow}>
      {children}
    </article>
  )
}
