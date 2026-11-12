import { useEffect, useRef } from 'react'

import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { profile } from '@/content'
import { useInView } from '@/lib/hooks'
import { CHECKS } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

/**
 * このページが自分を点検する計器盤。
 * 「隕石をぶつける」でどこかを本当に壊し、点検がそれを見つけられるかを試せる。
 */
export function PreflightSection() {
  const { preflight } = profile
  const { fault, results, phase, passed, failed, meteor, flying, impact, busy, run, strike, repair, locate } =
    usePreflight()
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -30% 0px')
  const replayed = useRef(false)

  // 最初の点検は見えない所で終わっているので、ここが初めて画面に入ったら、もう一度走らせて見せる
  useEffect(() => {
    if (!inView || replayed.current) return
    replayed.current = true
    if (!busy) run()
  }, [inView, busy, run])

  const message = impact
    ? '衝突を検知。どこが壊れたか調べます。'
    : flying
      ? '隕石が来ます。'
      : phase !== 'done'
      ? '点検しています。'
      : failed > 0
        ? `${failed} 件、落ちました。ちゃんと見つかったようです。`
        : meteor > 0
          ? '直りました。もう一度ぶつけても大丈夫です。'
          : '異常なし。発進できます。'

  const panel = (
    <div ref={ref} className="console" data-phase={phase} data-failed={failed > 0 || undefined}>
      <div className="console-bar">
        <span className="console-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          {CHECKS.length} 項目中 {passed} 合格
        </span>
      </div>
      <ol className="console-rows">
        {CHECKS.map((check) => {
          const state = results[check.id]
          return (
            <li key={check.id} data-status={state.status}>
              <span className="lamp" aria-hidden="true" />
              <div>
                <p className="row-label">{check.label}</p>
                <p className="row-detail">
                  {state.status === 'waiting' ? '待機中' : state.status === 'running' ? '確認中' : state.detail}
                </p>
                {state.status === 'fail' ? (
                  <button type="button" className="row-locate" onClick={() => locate(check.id)}>
                    壊れた所を見る
                  </button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
      <div className="console-foot">
        <p className="console-message" role="status">
          {message}
        </p>
        <div className="console-actions">
          {fault ? (
            <button type="button" className="btn btn-sun" onClick={repair} disabled={busy}>
              修理する
            </button>
          ) : (
            <button type="button" className="btn btn-sun" onClick={strike} disabled={busy}>
              隕石をぶつける
            </button>
          )}
          <button type="button" className="btn" onClick={run} disabled={busy}>
            もう一度点検する
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <Section
      id="preflight"
      title={preflight.title}
      lead={
        <>
          {preflight.lead.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="console-note">
            {preflight.note} <ExternalLink href={preflight.codeUrl}>{preflight.codeLabel}</ExternalLink>
          </p>
        </>
      }
      aside={panel}
    />
  )
}
