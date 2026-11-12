import type { CSSProperties, ReactNode } from 'react'

import { useInView } from '@/lib/hooks'

type SectionProps = {
  id: string
  title: string
  lead?: ReactNode
  children?: ReactNode
  /** 見出しの横に並べるもの（説明と操作を左右に分けたいとき） */
  aside?: ReactNode
}

/** 節の枠。見出しの文字は、初めて画面に入ったときに 1 回だけ下からせり上がる */
export function Section({ id, title, lead, children, aside }: SectionProps) {
  const [ref, inView] = useInView<HTMLElement>()

  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-title`} className="section" data-inview={inView}>
      <div className="page">
        <div className={aside ? 'section-head section-head-split' : 'section-head'}>
          <div>
            <h2
              id={`${id}-title`}
              className="section-title"
              aria-label={title}
              style={{ '--n': Array.from(title).length } as CSSProperties}
            >
              {Array.from(title).map((char, index) => (
                <span key={index} className="ch" style={{ '--i': index } as CSSProperties} aria-hidden="true">
                  {char}
                </span>
              ))}
            </h2>
            {lead ? <div className="section-lead">{lead}</div> : null}
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  )
}
