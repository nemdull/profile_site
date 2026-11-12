import { CheckMark } from '@/components/atoms/CheckMark'
import { ExternalLink } from '@/components/atoms/ExternalLink'
import { Stamp } from '@/components/molecules/Stamp'
import { profile } from '@/content'

/** 「できること」を、根拠と一緒に並べた表。根拠の無い行は scripts/check-content.mjs が止める */
export function SpecSheet() {
  const { claims, meta } = profile

  return (
    <section aria-labelledby="spec-title" className="relative mb-24 lg:mb-0">
      <div className="rounded-md border border-rule bg-surface shadow-[0_18px_40px_-28px_rgb(20_32_46/0.45)]">
        <header className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-3.5">
          <h2 id="spec-title" className="font-bold">
            できること
          </h2>
          <p className="text-sm text-soft">{claims.length} 件、すべて根拠つき</p>
        </header>
        <ul>
          {claims.map((item, index) => (
            <li key={item.claim} className="flex gap-3 border-b border-rule px-5 py-3.5 last:border-b-0">
              <CheckMark index={index} />
              <div className="min-w-0">
                <p className="phrase leading-snug font-bold">{item.claim}</p>
                <ul className="mt-1.5 space-y-1 text-sm leading-normal text-soft">
                  {item.evidence.map((evidence) => (
                    <li key={evidence.label} className="flex gap-2">
                      <span className="flex-none self-start rounded-sm border border-rule px-1.5 text-xs leading-5">{evidence.kind}</span>
                      {evidence.url ? <ExternalLink href={evidence.url}>{evidence.label}</ExternalLink> : <span>{evidence.label}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Stamp date={meta.reviewedOn} name={meta.name} className="absolute right-5 -bottom-[4.75rem] w-24 sm:-bottom-[5.25rem] sm:w-28" />
    </section>
  )
}
