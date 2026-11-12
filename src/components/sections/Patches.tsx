import type { CSSProperties } from 'react'

import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { profile } from '@/content'
import { useInView } from '@/lib/hooks'

// ワッペンの傾き（度）。縫い付けたように、少しずつばらつかせる
const TILTS = [-7, 5, -3, 8, -6, 4, -8, 3, -4]

// "2025.08" を「2025 年 8 月」にする
const when = (date: string) => {
  const [year, month] = date.split('.')
  return `${year} 年 ${Number(month)} 月`
}

/** 資格。宇宙服に縫い付けるワッペンに見立てて並べる */
export function Patches() {
  const { certifications } = profile
  const [ref, inView] = useInView<HTMLUListElement>('0px 0px -12% 0px')

  return (
    <Section
      id="certifications"
      title={certifications.title}
      lead={
        <p>
          {certifications.lead}{' '}
          <ExternalLink href={certifications.articleUrl}>{certifications.articleLabel}</ExternalLink>
        </p>
      }
    >
      <ul ref={ref} className="patches" data-inview={inView}>
        {certifications.items.map((item, index) => (
          <li
            key={item.name}
            style={{ '--i': index, '--tilt': `${TILTS[index % TILTS.length]}deg`, '--tone': `var(--color-${item.tone})` } as CSSProperties}
          >
            <div className="patch" aria-hidden="true">
              <span className="patch-mark">{item.mark}</span>
              <span className="patch-date">{item.date}</span>
            </div>
            <p className="patch-name">{item.name}</p>
            <p className="patch-when">{when(item.date)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
