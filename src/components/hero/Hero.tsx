import { useEffect, useRef, type MouseEvent } from 'react'

import { Intro } from '@/components/intro/Intro'
import { CheckNote } from '@/components/machine/CheckNote'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { profile, type LinkItem } from '@/content'
import { INTRO_TONE } from '@/content/rooms'
import { prefersReducedMotion } from '@/lib/hooks'
import { clamp, onScrollFrame, trackProgress } from '@/lib/scroll'
import { usePreflight } from '@/systems/preflight-context'

import { Headline } from './Headline'
import { Moon } from './Moon'
import { FLY_END, LATE_AT, PORTAL_FROM, PORTAL_FULL } from './stages'

// 隕石のあとに紛れ込む、一覧にないサイトへのリンク
const STRANGER: LinkItem = { label: '？？？', url: 'https://example.com/' }

/**
 * いちばん上の画面と、その奥にある自己紹介の部屋。
 * スクロールしているあいだ舞台が画面に留まり（留めるのは CSS の sticky）、見出しの文字が 1 つずつ飛んでいって、
 * 最後の「。」の明かりが広がり、その穴の向こうに自己紹介が見えてくる。
 * ここでは進み具合を CSS 変数（--fly と --grow）に書くだけで、動かすのは CSS（styles/hero.css）。
 * 中身が画面に収まらない端末と「動きを減らす」設定のときは、留めずに、上から順にふつうに並べる。
 */
export function Hero() {
  const { meta } = profile
  const { fault } = usePreflight()
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const lampRef = useRef<HTMLSpanElement>(null)
  const refit = useRef<() => void>(() => undefined)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const content = contentRef.current
    if (!track || !stage || !content) return

    const intro = stage.querySelector<HTMLElement>('.intro-text')
    let viewportWidth = -1
    let viewportHeight = -1

    // 明かりの位置と大きさを測って、色が広がる円の中心と半径にする
    const measure = () => {
      const lamp = lampRef.current
      const box = stage.getBoundingClientRect()
      if (!lamp || box.width === 0) return
      const dot = lamp.getBoundingClientRect()
      const x = dot.left + dot.width / 2 - box.left
      const y = dot.top + dot.height / 2 - box.top
      const reach = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y))
      stage.style.setProperty('--px', `${x.toFixed(1)}px`)
      stage.style.setProperty('--py', `${y.toFixed(1)}px`)
      // 半径は、拡大の動きに左右されない、置いたときの大きさから取る
      stage.style.setProperty('--r0', `${(lamp.offsetWidth / 2).toFixed(2)}px`)
      stage.style.setProperty('--reach', `${Math.ceil(reach)}px`)
    }

    // 留めて見せられるかどうかを決める。見出しも自己紹介も、画面 1 枚に収まるときだけ留める
    const fit = () => {
      track.dataset.pin = 'true'
      intro?.style.removeProperty('font-size')
      let pinned = !prefersReducedMotion() && content.scrollHeight <= stage.clientHeight + 1
      if (pinned && intro) {
        // 自己紹介が収まらなければ、収まるまで字を小さくする。それでも無理なら留めない
        const room = intro.parentElement
        let size = parseFloat(getComputedStyle(intro).fontSize)
        while (room && room.scrollHeight > room.clientHeight + 1 && size > 15) {
          size *= 0.95
          intro.style.fontSize = `${size.toFixed(2)}px`
        }
        if (room && room.scrollHeight > room.clientHeight + 1) {
          pinned = false
          intro.style.removeProperty('font-size')
        }
      }
      track.dataset.pin = String(pinned)
      measure()
    }
    refit.current = fit

    const stop = onScrollFrame((_, viewport) => {
      if (window.innerWidth !== viewportWidth || Math.abs(viewport - viewportHeight) > 120) {
        viewportWidth = window.innerWidth
        viewportHeight = viewport
        fit()
      }
      const progress = track.dataset.pin === 'true' ? trackProgress(track) : 0
      const grow = clamp((progress - PORTAL_FROM) / (PORTAL_FULL - PORTAL_FROM)) ** 2.2
      stage.style.setProperty('--fly', clamp(progress / FLY_END).toFixed(4))
      stage.style.setProperty('--grow', grow.toFixed(4))
      // 覆われて見えなくなった中身は、キーボードでも選べないようにする
      stage.dataset.out = String(grow >= 1)
    })

    // 書体が届くと字の幅が変わる。見出しが出そろったあとにも、もう一度測る
    document.fonts?.ready.then(fit, () => undefined)
    const timer = window.setTimeout(fit, 2500)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduce.addEventListener('change', fit)

    return () => {
      stop()
      window.clearTimeout(timer)
      reduce.removeEventListener('change', fit)
    }
  }, [])

  // 見出しが壊れたり直ったりすると、明かりの要素が作り直される。そのたびに測り直す
  useEffect(() => {
    const timer = window.setTimeout(() => refit.current(), 400)
    return () => window.clearTimeout(timer)
  }, [fault])

  // 「下に続きます」。留めているあいだは、明かりが広がりきって自己紹介を読みはじめる所まで、スクロールで連れていく
  const onward = (event: MouseEvent<HTMLAnchorElement>) => {
    const track = trackRef.current
    if (!track || track.dataset.pin !== 'true') return
    event.preventDefault()
    const top = track.getBoundingClientRect().top + window.scrollY
    const held = track.offsetHeight - (stageRef.current?.offsetHeight ?? window.innerHeight)
    window.scrollTo({ top: top + held * (PORTAL_FULL + 0.01), behavior: 'smooth' })
  }

  const links: (LinkItem & { state?: string })[] = profile.links
    .filter((link) => link.primary)
    .map((link, index) =>
      fault === 'https' && index === 0
        ? { ...link, url: link.url.replace('https://', 'http://'), state: 'broken' }
        : link,
    )
  if (fault === 'hosts') links.push({ ...STRANGER, state: 'stranger' })

  return (
    <div
      ref={trackRef}
      id="top"
      className="hero"
      data-room=""
      data-sky
      data-tone="night"
      data-late-room="intro"
      data-late-tone={INTRO_TONE}
      data-late-at={LATE_AT}
      data-pin="true"
    >
      <div ref={stageRef} className="hero-stage" data-hero-stage>
        {/* #top の行き先は、留まる舞台ではなく外側の枠に付けてある（舞台に付けると、戻ったときに留まり終わりの位置へ行ってしまう） */}
        <section ref={contentRef} className="hero-content tone-night" aria-label="いちばん上">
          <Headline lines={meta.headline} broken={fault === 'headline'} lampRef={lampRef} />
          <dl className="readout">
            <div>
              <dt>名前</dt>
              <dd>
                {meta.name}（{meta.reading}）
              </dd>
            </div>
            <div>
              <dt>仕事</dt>
              <dd>{meta.role}</dd>
            </div>
            <div>
              <dt>点検</dt>
              <dd className="readout-checks">
                <CheckNote id="headline" />
                <CheckNote id="avatar" />
              </dd>
            </div>
          </dl>
          <div className="hero-side">
            <Moon />
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
            <ul className="hero-links" aria-label="ほかの場所">
              {links.map((link) => (
                <li key={link.label}>
                  <ExternalLink href={link.url} className="pill" me={link.state !== 'stranger'}>
                    <span data-state={link.state}>{link.label}</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <a href="#intro" className="scroll-cue" onClick={onward}>
            <span>下に続きます</span>
            <i aria-hidden="true" />
          </a>
        </section>
        <Intro />
      </div>
    </div>
  )
}
