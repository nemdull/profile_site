import { useEffect, useRef } from 'react'

import { WARP_EVENT } from '@/lib/events'

type Star = {
  x: number
  y: number
  depth: number
  /** GLYPHS の何番目から瞬きはじめるか */
  phase: number
  /** 瞬きの間隔（ミリ秒） */
  pace: number
  warm: boolean
  sleepy: boolean
}

type Shot = { x: number; y: number; life: number }

// 星は文字で描く。明るさの代わりに、文字を入れ替えて瞬かせる
const GLYPHS = ['.', '.', '+', '*', '+', '.'] as const
const FONT = '"DotGothic16", monospace'
const TAIL = '-----==*'

/**
 * 夜の部屋の後ろに広がる、文字でできた星空。
 * 奥行きごとに流れる速さが違い、速くスクロールすると星が縦の線（|）に伸びる。たまに流れ星も通る。
 * 「動きを減らす」設定のときは、止まった星空を 1 回描くだけ。
 */
export function AsciiSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let stars: Star[] = []
    let frame = 0
    let previous = performance.now()
    let scroll = window.scrollY
    let lastScroll = scroll
    let speed = 0
    let warp = 0
    let drift = 0
    let shot: Shot | null = null
    let nextShot = 5000 + Math.random() * 5000
    let visible = true

    const seed = () => {
      const count = Math.min(150, Math.round((width * height) / 9000))
      stars = Array.from({ length: count }, () => {
        const depth = 0.25 + Math.random() * 0.75
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          phase: Math.floor(Math.random() * GLYPHS.length),
          pace: 500 + Math.random() * 1400,
          warm: Math.random() < 0.14,
          sleepy: Math.random() < 0.05,
        }
      })
    }

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      const stretch = Math.min(5, Math.floor(Math.abs(speed) * 0.0022 + warp * 6))
      const direction = speed < 0 ? -1 : 1
      for (const star of stars) {
        const size = Math.round(9 + star.depth * 11)
        // 文字のマス目にそろえて動かす（なめらかに動かすより、機械が描いている感じが出る）
        const y = Math.round((((star.y - scroll * star.depth * 0.2 - drift * star.depth) % height) + height) % height)
        const x = Math.round(star.x)
        const alpha = 0.3 + 0.7 * star.depth
        context.font = `${size}px ${FONT}`
        context.fillStyle = star.warm ? `rgba(255, 217, 26, ${alpha})` : `rgba(243, 242, 236, ${alpha})`
        if (stretch > 0) {
          const tail = Math.max(1, Math.round(stretch * star.depth))
          for (let step = 0; step < tail; step++) context.fillText('|', x, y + step * size * 0.8 * direction)
          continue
        }
        if (star.sleepy) {
          context.fillText('z', x, y)
          continue
        }
        const beat = Math.floor(now / star.pace) + star.phase
        context.fillText(GLYPHS[beat % GLYPHS.length], x, y)
      }
    }

    const drawShot = (elapsed: number) => {
      if (!shot) return
      shot.x -= elapsed * 0.62
      shot.y += elapsed * 0.3
      shot.life -= elapsed
      if (shot.life <= 0) {
        shot = null
        return
      }
      context.save()
      context.translate(Math.round(shot.x), Math.round(shot.y))
      context.rotate(Math.PI - Math.atan2(0.3, 0.62))
      context.font = `16px ${FONT}`
      context.textAlign = 'right'
      context.fillStyle = `rgba(255, 217, 26, ${Math.min(1, shot.life / 300)})`
      context.fillText(TAIL, 0, 0)
      context.restore()
    }

    const tick = (now: number) => {
      const elapsed = Math.min(64, now - previous)
      previous = now
      scroll = window.scrollY
      const instant = ((scroll - lastScroll) / Math.max(elapsed, 1)) * 1000
      lastScroll = scroll
      speed += (instant - speed) * 0.2
      warp *= 0.93
      drift += elapsed * (0.003 + warp * 1.2)
      draw(now)
      nextShot -= elapsed
      if (nextShot <= 0 && !shot) {
        shot = { x: width * (0.35 + Math.random() * 0.65), y: -20, life: 1100 }
        nextShot = 8000 + Math.random() * 9000
      }
      drawShot(elapsed)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reduce.matches || document.hidden || !visible) {
        speed = 0
        warp = 0
        draw(0)
        return
      }
      previous = performance.now()
      lastScroll = window.scrollY
      frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      // スマホはスクロールでアドレスバーが出入りして高さが変わる。そのたびに星を並べ直すとちらつくので、
      // 幅が変わったときと、高さが大きく変わったときだけ並べ直す
      const reseed = window.innerWidth !== width || Math.abs(window.innerHeight - height) > 160
      width = window.innerWidth
      if (reseed) height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (reseed) seed()
      start()
    }

    const onWarp = () => {
      if (!reduce.matches) warp = 1
    }

    // 星空が見えるのは、地が透けている夜の部屋だけ。どれも画面に無いあいだは描くのを休む
    const seen = new Map<Element, boolean>()
    const watcher = new IntersectionObserver((entries) => {
      for (const entry of entries) seen.set(entry.target, entry.isIntersecting)
      const next = Array.from(seen.values()).some(Boolean)
      if (next === visible) return
      visible = next
      start()
    })
    document.querySelectorAll('[data-sky]').forEach((room) => watcher.observe(room))

    resize()
    // 星の書体が届いたら描き直す（止めて見せているときも、字の形がそろうように）
    document.fonts?.load(`16px ${FONT}`, '.+*|z').then(start, () => undefined)
    window.addEventListener('resize', resize)
    window.addEventListener(WARP_EVENT, onWarp)
    document.addEventListener('visibilitychange', start)
    reduce.addEventListener('change', start)

    return () => {
      cancelAnimationFrame(frame)
      watcher.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener(WARP_EVENT, onWarp)
      document.removeEventListener('visibilitychange', start)
      reduce.removeEventListener('change', start)
    }
  }, [])

  return <canvas ref={canvasRef} className="sky" aria-hidden="true" />
}
