import { CheckNote } from '@/components/machine/CheckNote'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Room } from '@/components/ui/Room'
import { profile, type Claim } from '@/content'
import { useInView } from '@/lib/hooks'
import { usePreflight } from '@/systems/preflight-context'

// 隕石で根拠が飛ばされる行（上から 3 つ目）
const HIT_ROW = 2

/** 「できること」の 1 行。画面に入ると、主張に蛍光ペンの線が引かれる */
function ClaimRow({ item, lost }: { item: Claim; lost: boolean }) {
  const [ref, inView] = useInView<HTMLLIElement>('0px 0px -22% 0px')

  return (
    <li ref={ref} data-claim data-lost={lost || undefined} data-inview={inView}>
      <p className="claim-text">
        <span className="mark">{item.claim}</span>
      </p>
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
}

export function Claims() {
  const { claims } = profile
  const { fault } = usePreflight()

  return (
    <Room id="claims" title={claims.title} lead={<p>{claims.lead}</p>} note={<CheckNote id="evidence" />}>
      <ul className="claims">
        {claims.items.map((item, index) => (
          <ClaimRow key={item.claim} item={item} lost={fault === 'evidence' && index === HIT_ROW} />
        ))}
      </ul>
    </Room>
  )
}
