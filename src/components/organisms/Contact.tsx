import { ExternalLink } from '@/components/atoms/ExternalLink'
import { Section } from '@/components/molecules/Section'
import { profile } from '@/content'

export function Contact() {
  const { contact } = profile
  const [first, ...rest] = contact.links

  return (
    <Section id="contact" title="連絡">
      <p className="max-w-[34em] text-lg">{contact.text}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {first ? (
          <ExternalLink
            href={first.url}
            className="rounded-md bg-ink px-5 py-2.5 font-bold text-paper transition-opacity hover:opacity-85"
          >
            {first.label}
          </ExternalLink>
        ) : null}
        {rest.map((link) => (
          <ExternalLink key={link.url} href={link.url}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </Section>
  )
}
