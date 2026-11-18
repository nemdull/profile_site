import { useEffect, useRef } from 'react'

import { Led, type LedSegment } from '@/components/machine/Led'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Room } from '@/components/ui/Room'
import { profile } from '@/content'
import { useInView } from '@/lib/hooks'
import { CHECKS } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

/** 全角の空白。電光掲示板で、文と文のあいだを 1 文字ぶん空ける */
const SPACE = '\u3000'

/**
 * このページが自分を点検する部屋。上の電光掲示板に、いまの結果が流れる。
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

  // 電光掲示板に流す文。合格は緑、異常は赤、そのほかは橙
  let board: LedSegment[]
  if (impact || flying) {
    board = [{ text: message, tone: 'alert' }]
  } else if (phase !== 'done') {
    board = [{ text: `点検中 ${passed}/${CHECKS.length}` }]
  } else if (failed > 0) {
    const broken = CHECKS.filter((check) => results[check.id].status === 'fail')
    board = [
      { text: `異常 ${failed} 件`, tone: 'alert' },
      ...broken.map((check) => ({ text: `${SPACE}${check.short}${SPACE}${results[check.id].detail}` })),
      { text: `${SPACE}「修理する」で直ります。` },
    ]
  } else {
    board = [
      { text: `点検 ${passed}/${CHECKS.length} 合格`, tone: 'go' },
      { text: `${SPACE}${message}` },
      ...CHECKS.map((check) => ({ text: `${SPACE}${check.short} ${results[check.id].brief}` })),
    ]
  }

  const panel = (
    <div ref={ref} className="console" data-phase={phase} data-failed={failed > 0 || undefined}>
      <div className="console-bar">
        <span>点検盤</span>
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
            <button type="button" className="btn btn-primary" onClick={repair} disabled={busy}>
              修理する
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={strike} disabled={busy}>
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
    <Room
      id="preflight"
      title={preflight.title}
      banner={<Led segments={board} />}
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
