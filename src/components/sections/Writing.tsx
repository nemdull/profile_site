import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { profile } from '@/content'

export function Writing() {
  const { writing } = profile

  return (
    <Section id="writing" title={writing.title} lead={<p>{writing.lead}</p>}>
      <ul className="articles">
        {writing.items.map((article) => (
          <li key={article.url}>
            <a href={article.url} target="_blank" rel="noreferrer">
              <span className="article-date">{article.date}</span>
              <span className="article-title">{article.title}</span>
              <span className="article-site">{article.site}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className="more-links">
        {writing.more.map((link) => (
          <li key={link.url}>
            <ExternalLink href={link.url} className="btn">
              {link.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}
