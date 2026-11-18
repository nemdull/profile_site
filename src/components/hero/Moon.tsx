import { useEffect, useRef } from 'react'

import avatar from '@/assets/images/avatar.webp'
import { prefersReducedMotion } from '@/lib/hooks'
import { usePreflight } from '@/systems/preflight-context'

// 読み込めない画像。隕石でアイコンの通信が切れたときに差し替える
const DEAD_IMAGE = 'data:image/png;base64,AAAA'

// 組織的ディザ（Bayer 4×4）のしきい値。白と群青の 2 色だけで濃淡を出す
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
// 1 辺のマスの数。粗い絵から細かい絵へ、段を踏んで近づける
const STEPS = [8, 12, 18, 28, 44, 72, 112]
const DURATION = 1400
const MOON: readonly [number, number, number] = [243, 242, 236]
const NIGHT: readonly [number, number, number] = [27, 47, 214]

/**
 * アイコンの月。開いたときは、機械が粗い点の絵から少しずつ描き起こして、最後に本物の絵になる。
 * 隕石で通信が切れると、砂嵐になる。
 */
export function Moon() {
  const { fault } = usePreflight()
  const dead = fault === 'avatar'
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { willReadFrequently: true })
    if (!image || !canvas || !context) return
    if (prefersReducedMotion()) {
      canvas.dataset.done = 'true'
      return
    }

    let frame = 0
    const drawStep = (cells: number) => {
      canvas.width = cells
      canvas.height = cells
      context.drawImage(image, 0, 0, cells, cells)
      const picture = context.getImageData(0, 0, cells, cells)
      const { data } = picture
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const at = (y * cells + x) * 4
          const light = (data[at] * 0.299 + data[at + 1] * 0.587 + data[at + 2] * 0.114) / 255
          const color = light > (BAYER[(x & 3) + (y & 3) * 4] + 0.5) / 16 ? MOON : NIGHT
          data[at] = color[0]
          data[at + 1] = color[1]
          data[at + 2] = color[2]
          data[at + 3] = 255
        }
      }
      context.putImageData(picture, 0, 0)
    }

    const run = () => {
      if (image.naturalWidth === 0) {
        canvas.dataset.done = 'true'
        return
      }
      const started = performance.now()
      let shown = -1
      const tick = (now: number) => {
        const progress = (now - started) / DURATION
        const step = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
        if (step !== shown) {
          shown = step
          drawStep(STEPS[step])
        }
        if (progress < 1) frame = requestAnimationFrame(tick)
        else canvas.dataset.done = 'true'
      }
      frame = requestAnimationFrame(tick)
    }

    if (image.complete) run()
    else image.addEventListener('load', run, { once: true })

    return () => {
      cancelAnimationFrame(frame)
      image.removeEventListener('load', run)
    }
  }, [])

  return (
    <div className="moon-wrap">
      <div className="moon" data-dead={dead || undefined}>
        <img
          ref={imageRef}
          data-avatar
          src={dead ? DEAD_IMAGE : avatar}
          alt="nemdull のアイコン。宇宙服のヘルメットをかぶった青い猫"
          width={640}
          height={640}
          decoding="async"
        />
        <canvas ref={canvasRef} className="moon-dither" aria-hidden="true" />
        {dead ? <span className="moon-static">通信が途絶えました</span> : null}
      </div>
      {dead ? null : (
        <div className="zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </div>
      )}
    </div>
  )
}
