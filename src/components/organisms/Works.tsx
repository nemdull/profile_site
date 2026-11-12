import { ExternalLink } from '@/components/atoms/ExternalLink'
import { Section } from '@/components/molecules/Section'
import { profile } from '@/content'

export function Works() {
  return (
    <Section id="works" title="つくったもの">
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {profile.works.map((work) => (
          <article key={work.title}>
            <h3 className="flex flex-wrap items-baseline gap-x-3 text-lg leading-snug font-bold">
              {work.title}
              {work.status ? <span className="text-sm font-normal text-soft">{work.status}</span> : null}
            </h3>
            <p className="phrase mt-2">{work.lead}</p>
            {work.detail ? <p className="mt-2 text-soft">{work.detail}</p> : null}
            {work.links.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {work.links.map((link) => (
                  <li key={link.url}>
                    <ExternalLink href={link.url}>{link.label}</ExternalLink>
                    {link.note ? <span className="ml-1.5 text-sm text-soft">（{link.note}）</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-sm text-soft">{work.tech.join('、')}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
