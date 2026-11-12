import { ExternalLink } from '@/components/atoms/ExternalLink'
import { Section } from '@/components/molecules/Section'
import { profile } from '@/content'

const linkOf = (label: string) => profile.links.find((link) => link.label === label)

export function Writing() {
  const qiita = linkOf('Qiita')
  const zenn = linkOf('Zenn')
  const slides = linkOf('Speaker Deck')

  return (
    <Section id="writing" title="書いたもの">
      <ul className="border-b border-rule">
        {profile.writing.map((article) => (
          <li key={article.url} className="grid gap-x-8 gap-y-0.5 border-t border-rule py-3.5 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
            <p className="text-sm leading-7 text-soft">{article.date}</p>
            <p className="leading-7">
              <ExternalLink href={article.url}>{article.title}</ExternalLink>
              <span className="ml-2 text-sm text-soft">{article.site}</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-soft">
        ほかの記事は
        {qiita ? <ExternalLink href={qiita.url}>Qiita</ExternalLink> : 'Qiita'}と
        {zenn ? <ExternalLink href={zenn.url}>Zenn</ExternalLink> : 'Zenn'}
        に、発表資料は
        {slides ? <ExternalLink href={slides.url}>Speaker Deck</ExternalLink> : 'Speaker Deck'}
        にあります。
      </p>
    </Section>
  )
}
