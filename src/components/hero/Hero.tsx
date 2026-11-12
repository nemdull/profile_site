import { ExternalLink } from '@/components/ui/ExternalLink'
import { profile } from '@/content'
import { usePreflight } from '@/systems/preflight-context'

import { Headline } from './Headline'
import { Moon } from './Moon'

export function Hero() {
  const { meta } = profile
  const { fault } = usePreflight()

  return (
    <section id="top" className="hero">
      <div className="page hero-grid">
        <div className="hero-copy">
          <Headline lines={meta.headline} broken={fault === 'headline'} />
          <div className="hero-intro">
            {meta.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="hero-actions">
            {meta.actions.map((action, index) => (
              <li key={action.url}>
                {action.url.startsWith('#') ? (
                  <a href={action.url} className={index === 0 ? 'btn btn-primary' : 'btn'}>
                    {action.label}
                  </a>
                ) : (
                  <ExternalLink href={action.url} className={index === 0 ? 'btn btn-primary' : 'btn'}>
                    {action.label}
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Moon />
      </div>
      <a href="#preflight" className="scroll-cue">
        <span>下に続きます</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}
