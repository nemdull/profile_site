import { ExternalLink } from '@/components/atoms/ExternalLink'
import { profile } from '@/content'

import { SpecSheet } from './SpecSheet'

export function Hero() {
  const { meta, links } = profile
  const primaryLinks = links.filter((link) => link.primary)

  return (
    <section id="top" className="page pt-10 pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16">
        <div>
          <h1 className="text-[clamp(2rem,9vw,4.25rem)] leading-[1.22] font-bold tracking-[0.01em] lg:text-[clamp(3rem,5.1vw,4.1rem)]">
            {meta.tagline.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
          <p className="phrase mt-8 max-w-[34em] text-lg leading-[1.9]">{meta.lead}</p>
          <p className="mt-4 max-w-[36em] text-soft">{meta.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {primaryLinks.map((link) => (
              <li key={link.url}>
                <ExternalLink href={link.url}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
        <SpecSheet />
      </div>
    </section>
  )
}
