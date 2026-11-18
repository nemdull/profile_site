import type { ReactNode } from 'react'

import { ExternalLink } from '@/components/ui/ExternalLink'
import { Room } from '@/components/ui/Room'
import { profile, work, type Work } from '@/content'
import type { Tone } from '@/content/rooms'
import { CHECKS } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

import { Gauge } from './Gauge'
import { Lettering } from './Lettering'

function WorkText({ item, children }: { item: Work; children?: ReactNode }) {
  return (
    <div className="work-text">
      <h3 className="work-title">
        {item.title}
        {item.status ? <span className="work-status">{item.status}</span> : null}
      </h3>
      <p className="work-lead">{item.lead}</p>
      {item.detail ? <p className="work-detail">{item.detail}</p> : null}
      {children}
      {item.links.length > 0 ? (
        <ul className="work-links">
          {item.links.map((link) => (
            <li key={link.url}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
              {link.note ? <span className="work-note">（{link.note}）</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="chips" aria-label="使った技術">
        {item.tech.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

/** つくったものの 1 枚。札ごとに地の色を変える */
function Card({ tone, className = '', children }: { tone: Tone; className?: string; children: ReactNode }) {
  return <article className={`work tone-${tone} ${className}`.trim()}>{children}</article>
}

/** このサイトの欄に出す、いまの点検結果 */
function SelfReport() {
  const { passed, failed, phase } = usePreflight()
  const state = failed > 0 ? 'fail' : phase === 'done' ? 'pass' : 'running'
  return (
    <a href="#preflight" className="note self-report" data-status={state}>
      <span className="lamp" aria-hidden="true" />
      {failed > 0
        ? `いま ${failed} 件、落ちています`
        : phase === 'done'
          ? `いまの点検は ${passed}/${CHECKS.length} 合格`
          : '点検しています'}
    </a>
  )
}

export function Works() {
  return (
    <Room id="works" title={profile.works.title}>
      <div className="works-grid">
        <Card tone="moon" className="work-feature">
          <WorkText item={work('sf-meter')} />
          <Gauge />
        </Card>

        <Card tone="lemon">
          <div className="bubble" aria-hidden="true">
            <span className="bubble-who">匿名さん</span>
            <span className="bubble-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
          <WorkText item={work('slack-bot')} />
        </Card>

        <Card tone="lavender">
          <Lettering />
          <WorkText item={work('sakujiru')} />
        </Card>

        <Card tone="moon">
          <p className="typing" aria-hidden="true">
            <span>改訂 2 版、書いています</span>
          </p>
          <WorkText item={work('book')} />
        </Card>

        <Card tone="navy">
          <div className="phone" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <WorkText item={work('app')} />
        </Card>

        <Card tone="lemon">
          <WorkText item={work('site')}>
            <SelfReport />
          </WorkText>
        </Card>
      </div>
    </Room>
  )
}
