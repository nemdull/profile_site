import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: string
  children: ReactNode
}

/** 左に節の名前、右に中身。狭い画面では縦に並ぶ */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="page">
      <div className="grid gap-y-6 border-t border-rule py-14 sm:py-16 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-12">
        <h2 id={`${id}-title`} className="text-xl leading-snug font-bold">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}
