import type { ReactNode } from 'react'

import { ExternalLink } from '@/components/ui/ExternalLink'
import { Panel } from '@/components/ui/Panel'
import { Section } from '@/components/ui/Section'
import { profile, work, type Work } from '@/content'
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

/** このサイトの欄に出す、いまの点検結果 */
function SelfReport() {
  const { passed, failed, phase } = usePreflight()
  const state = failed > 0 ? 'fail' : phase === 'done' ? 'pass' : 'running'
  return (
    <a href="#preflight" className="self-report" data-state={state}>
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
    <Section id="works" title={profile.works.title}>
      <div className="works-grid">
        <Panel className="panel-wide panel-meter">
          <WorkText item={work('sf-meter')} />
          <Gauge />
        </Panel>

        <Panel className="panel-half">
          <div className="bubble" aria-hidden="true">
            <span className="bubble-who">匿名さん</span>
            <span className="bubble-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
          <WorkText item={work('slack-bot')} />
        </Panel>

        <Panel className="panel-half">
          <Lettering />
          <WorkText item={work('sakujiru')} />
        </Panel>

        <Panel className="panel-third">
          <p className="typing" aria-hidden="true">
            <span>改訂 2 版、書いています</span>
          </p>
          <WorkText item={work('book')} />
        </Panel>

        <Panel className="panel-third">
          <div className="phone" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <WorkText item={work('app')} />
        </Panel>

        <Panel className="panel-third">
          <WorkText item={work('site')}>
            <SelfReport />
          </WorkText>
        </Panel>
      </div>
    </Section>
  )
}
