import type { CSSProperties, PointerEvent } from 'react'

import { CheckNote } from '@/components/machine/CheckNote'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { profile } from '@/content'
import { toneAbove, toneOf } from '@/content/rooms'
import { useInView } from '@/lib/hooks'

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

/**
 * 最後の部屋。連絡先と、ほかの場所へのリンク、そのまま下にフッターが続く。
 * 夜の部屋なので、うしろに星空が見える。
 */
export function Contact() {
  const { contact, links, meta } = profile
  const [ref, inView] = useInView<HTMLElement>()
  const tone = toneOf('contact')
  const chars = Array.from(contact.title)

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      className={`room tone-${tone} contact`}
      data-room=""
      data-sky
      data-tone={tone}
      data-inview={inView}
      style={{ '--above': `var(--color-${toneAbove('contact')})` } as CSSProperties}
    >
      <div className="seam" aria-hidden="true" />
      <div className="page">
        <h2
          id="contact-title"
          className="room-title contact-title"
          aria-label={contact.title}
          style={{ '--n': chars.length } as CSSProperties}
        >
          {chars.map((char, index) => (
            <span
              key={index}
              className="ch"
              style={{ '--i': index, '--rot': `${index % 2 ? 6 : -5}deg`, '--dy': `${(index % 3) * 0.05}em` } as CSSProperties}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </h2>
        <div className="contact-grid">
          <div>
            <p className="contact-text">{contact.text}</p>
            <ul className="contact-actions">
              {contact.links.map((link, index) => (
                <li key={link.url}>
                  <ExternalLink href={link.url} className={index === 0 ? 'btn btn-primary' : 'btn'}>
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="elsewhere-title">{contact.elsewhere}</h3>
            <ul className="elsewhere">
              {links.map((link) => (
                <li key={link.url}>
                  <ExternalLink href={link.url} className="pill" me>
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
            <p className="elsewhere-notes">
              <CheckNote id="https" />
              <CheckNote id="hosts" />
            </p>
          </div>
        </div>
      </div>
      <Wordmark name={meta.name} />
    </section>
  )
}

export function Footer() {
  const { contact, meta } = profile

  return (
    <footer className="footer tone-navy">
      <div className="ruler" aria-hidden="true" />
      <div className="page footer-row">
        <p>{contact.thanks}</p>
        <p className="footer-meta">
          <CheckNote id="overflow" />
          <span>© 2026 {meta.name}</span>
          <ExternalLink href={meta.repoUrl}>このサイトのコード</ExternalLink>
        </p>
      </div>
    </footer>
  )
}
