import { ExternalLink } from '@/components/atoms/ExternalLink'
import { Section } from '@/components/molecules/Section'
import { profile, type DatedItem } from '@/content'

function DatedList({ items }: { items: DatedItem[] }) {
  return (
    <ul className="grid gap-x-12 sm:grid-cols-2">
      {items.map((item) => (
        <li key={`${item.date}-${item.name}`} className="flex gap-4 border-t border-rule py-3">
          <span className="w-[7.75rem] flex-none text-sm leading-7 whitespace-nowrap text-soft">{item.date}</span>
          <span className="min-w-0 leading-7">
            {item.url ? <ExternalLink href={item.url}>{item.name}</ExternalLink> : item.name}
            {item.note ? <span className="block text-sm text-soft">{item.note}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Certifications() {
  return (
    <Section id="certifications" title="資格">
      <DatedList items={profile.certifications} />
    </Section>
  )
}

export function Background() {
  return (
    <Section id="background" title="コミュニティとインターン">
      <DatedList items={profile.background} />
    </Section>
  )
}
