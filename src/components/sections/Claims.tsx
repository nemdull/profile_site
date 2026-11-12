import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { profile } from '@/content'
import { usePreflight } from '@/systems/preflight-context'

// 隕石で根拠が飛ばされる行（上から 3 つ目）
const HIT_ROW = 2

export function Claims() {
  const { claims } = profile
  const { fault } = usePreflight()

  return (
    <Section id="claims" title={claims.title} lead={<p>{claims.lead}</p>}>
      <ul className="claims">
        {claims.items.map((item, index) => {
          const lost = fault === 'evidence' && index === HIT_ROW
          return (
            <li key={item.claim} data-claim data-lost={lost || undefined}>
              <p className="claim-text">{item.claim}</p>
              {lost ? (
                <p className="fault-note">根拠が、どこかへ飛んでいきました</p>
              ) : (
                <ul className="evidence">
                  {item.evidence.map((entry) => (
                    <li key={entry.label} data-evidence className="tag">
                      <span className="tag-kind">{entry.kind}</span>
                      {entry.url ? <ExternalLink href={entry.url}>{entry.label}</ExternalLink> : <span>{entry.label}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
