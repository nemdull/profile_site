import { useEffect, useRef } from 'react'

import { WARP_EVENT } from '@/lib/events'

type Star = { x: number; y: number; depth: number; size: number; pace: number; warm: boolean }
type Shot = { x: number; y: number; vx: number; vy: number; life: number }

/**
 * 背景の星。奥行きを 3 段に分けて、スクロールすると手前の星ほど速く流れる。
 * 速くスクロールするほど星が線になり、飛んでいる感じが出る。たまに流れ星も通る。
 * 「動きを減らす」設定のときは、止まった星空を 1 回描くだけ。
 */
export function Starfield() {
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
    let pointer = 0
    let shot: Shot | null = null
    let nextShot = 4000 + Math.random() * 5000

    const seed = () => {
      const count = Math.min(240, Math.round((width * height) / 5200))
      stars = Array.from({ length: count }, () => {
        const depth = 0.25 + Math.random() * 0.75
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          size: 0.4 + depth * 1.3 * Math.random(),
          pace: 0.6 + Math.random() * 1.8,
          warm: Math.random() < 0.12,
        }
      })
    }

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height)
      const stretch = Math.min(70, Math.abs(speed) * 0.02 + warp * 120)
      const direction = speed < 0 ? -1 : 1
      for (const star of stars) {
        const y = (((star.y - scroll * star.depth * 0.22 - drift * star.depth) % height) + height) % height
        const x = (((star.x + pointer * star.depth * 14) % width) + width) % width
        const twinkle = 0.72 + 0.28 * Math.sin(now * 0.001 * star.pace + star.x)
        const alpha = (0.25 + 0.75 * star.depth) * twinkle
        const color = star.warm ? `rgba(255, 216, 150, ${alpha})` : `rgba(214, 234, 255, ${alpha})`
        const tail = stretch * star.depth
        if (tail > 1.5) {
          context.strokeStyle = color
          context.lineWidth = star.size
          context.beginPath()
          context.moveTo(x, y)
          context.lineTo(x, y + tail * direction)
          context.stroke()
        } else {
          context.fillStyle = color
          context.beginPath()
          context.arc(x, y, star.size, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const drawShot = (elapsed: number) => {
      if (!shot) return
      shot.x += shot.vx * elapsed
      shot.y += shot.vy * elapsed
      shot.life -= elapsed
      if (shot.life <= 0) {
        shot = null
        return
      }
      const fade = Math.min(1, shot.life / 300)
      const tail = context.createLinearGradient(shot.x, shot.y, shot.x - shot.vx * 160, shot.y - shot.vy * 160)
      tail.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`)
      tail.addColorStop(1, 'rgba(102, 191, 240, 0)')
      context.strokeStyle = tail
      context.lineWidth = 1.6
      context.beginPath()
      context.moveTo(shot.x, shot.y)
      context.lineTo(shot.x - shot.vx * 160, shot.y - shot.vy * 160)
      context.stroke()
    }

    const tick = (now: number) => {
      const elapsed = Math.min(64, now - previous)
      previous = now
      scroll = window.scrollY
      const instant = ((scroll - lastScroll) / Math.max(elapsed, 1)) * 1000
      lastScroll = scroll
      speed += (instant - speed) * 0.18
      warp *= 0.94
      drift += elapsed * (0.004 + warp * 1.4)
      draw(now)
      nextShot -= elapsed
      if (nextShot <= 0 && !shot) {
        shot = { x: width * (0.3 + Math.random() * 0.7), y: -20, vx: -0.55 - Math.random() * 0.3, vy: 0.42, life: 900 }
        nextShot = 7000 + Math.random() * 9000
      }
      drawShot(elapsed)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reduce.matches || document.hidden) {
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

    const onPointer = (event: PointerEvent) => {
      pointer = event.clientX / Math.max(width, 1) - 0.5
    }
    const onWarp = () => {
      if (!reduce.matches) warp = 1
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener(WARP_EVENT, onWarp)
    document.addEventListener('visibilitychange', start)
    reduce.addEventListener('change', start)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener(WARP_EVENT, onWarp)
      document.removeEventListener('visibilitychange', start)
      reduce.removeEventListener('change', start)
    }
  }, [])

  return (
    <>
      <div className="sky" aria-hidden="true" />
      <canvas ref={canvasRef} className="stars" aria-hidden="true" />
    </>
  )
}
