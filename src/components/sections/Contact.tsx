import type { CSSProperties, PointerEvent } from 'react'

import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { profile } from '@/content'

/** いちばん下の大きな名前。ポインターを近づけると、近い文字ほど持ち上がる */
function Wordmark({ name }: { name: string }) {
  const lift = (event: PointerEvent<HTMLParagraphElement>) => {
    for (const letter of event.currentTarget.children) {
      if (!(letter instanceof HTMLElement)) continue
      const box = letter.getBoundingClientRect()
      const distance = Math.abs(event.clientX - (box.left + box.width / 2))
      const pull = Math.max(0, 1 - distance / (box.width * 1.6))
      letter.style.setProperty('--lift', `${(-0.16 * pull).toFixed(3)}em`)
      letter.dataset.hot = pull > 0.55 ? 'true' : 'false'
    }
  }
  const drop = (event: PointerEvent<HTMLParagraphElement>) => {
    for (const letter of event.currentTarget.children) {
      if (!(letter instanceof HTMLElement)) continue
      letter.style.setProperty('--lift', '0em')
      letter.dataset.hot = 'false'
    }
  }

  return (
    <p className="wordmark" aria-hidden="true" onPointerMove={lift} onPointerLeave={drop}>
      {Array.from(name).map((char, index) => (
        <span key={index} style={{ '--i': index } as CSSProperties}>
          {char}
        </span>
      ))}
    </p>
  )
}

export function Contact() {
  const { contact, links } = profile

  return (
    <Section id="contact" title={contact.title} lead={<p>{contact.text}</p>}>
      <ul className="contact-actions">
        {contact.links.map((link, index) => (
          <li key={link.url}>
            <ExternalLink href={link.url} className={index === 0 ? 'btn btn-primary' : 'btn'}>
              {link.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
      <h3 className="elsewhere-title">{contact.elsewhere}</h3>
      <ul className="elsewhere">
        {links.map((link) => (
          <li key={link.url}>
            <ExternalLink href={link.url}>{link.label}</ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Footer() {
  const { contact, meta } = profile

  return (
    <footer className="footer">
      <Wordmark name={meta.name} />
      <div className="page footer-row">
        <p>{contact.thanks}</p>
        <p className="footer-meta">
          <span>© 2026 {meta.name}</span>
          <ExternalLink href={meta.repoUrl}>このサイトのコード</ExternalLink>
        </p>
      </div>
    </footer>
  )
}
