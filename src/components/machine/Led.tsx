import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/lib/hooks'

export type LedTone = 'amber' | 'go' | 'alert'
export type LedSegment = { text: string; tone?: LedTone }

// DotGothic16 は 16×16 のマス目に 15 ドットの字が入っている書体なので、
// 大きめに描いてからマス目の中心を拾えば、字のドットをそのまま取り出せる。
const ROWS = 15
const PAD = 2 // 上下の余白（ドット数）
const SCALE = 4 // ドットに起こすときの、1 マスの大きさ（px）
const FONT_PX = 16 * SCALE
const FONT = `${FONT_PX}px "DotGothic16", monospace`
const GRID_SHIFT = FONT_PX / 32 // 字は em の中央に置かれていて、マス目は半ドットずれている
const BOTTOM_ROW = FONT_PX * 0.0575 // ベースラインから、いちばん下の段の中心まで

const SPEED = 30 // 1 秒に流れるドット数
const HOLD = 1500 // 流れはじめる前に止めておく時間（ミリ秒）
const GAP = 30 // 文の終わりと、次の周回の頭のあいだ（ドット数）
const LEAD = 2 // 左端の余白（ドット数）

const TONES: readonly LedTone[] = ['amber', 'go', 'alert']
const COLORS: Record<LedTone, string> = { amber: '#ffb224', go: '#3ee08f', alert: '#ff5a4f' }
const UNLIT = '#151b5a'

type Bitmap = { cols: number; lit: Uint16Array; tone: Uint8Array }

/** 文字列を、縦 15 ドットの点の並びに起こす */
function rasterize(segments: LedSegment[]): Bitmap {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return { cols: 0, lit: new Uint16Array(0), tone: new Uint8Array(0) }

  context.font = FONT
  const widths = segments.map((segment) => context.measureText(segment.text).width)
  const total = widths.reduce((sum, width) => sum + width, 0)
  const cols = Math.round(total / SCALE)
  canvas.width = Math.ceil(total) + SCALE * 2
  canvas.height = FONT_PX + SCALE * 4

  // 大きさを変えると設定が消えるので、入れ直す
  context.font = FONT
  context.textBaseline = 'alphabetic'
  context.fillStyle = '#fff'
  const baseline = Math.round(FONT_PX * 0.88) + SCALE

  const tone = new Uint8Array(cols)
  let x = 0
  segments.forEach((segment, index) => {
    context.fillText(segment.text, x, baseline)
    const from = Math.round(x / SCALE)
    x += widths[index]
    tone.fill(TONES.indexOf(segment.tone ?? 'amber'), from, Math.min(cols, Math.round(x / SCALE)))
  })

  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height)
  const lit = new Uint16Array(cols)
  for (let col = 0; col < cols; col++) {
    const px = Math.round(col * SCALE + GRID_SHIFT + SCALE / 2)
    for (let row = 0; row < ROWS; row++) {
      const py = Math.round(baseline + BOTTOM_ROW - (ROWS - 1 - row) * SCALE)
      if (px >= width || py < 0 || py >= height) continue
      if (data[(py * width + px) * 4 + 3] > 110) lit[col] |= 1 << row
    }
  }
  return { cols, lit, tone }
}

type LedProps = {
  /** 流す文。色を変えたい所で区切って渡す */
  segments: LedSegment[]
}

/**
 * 駅の電光掲示板のように、文を点で流して見せる板。
 * 板より長い文は右から左へ流れる。「動きを減らす」設定のときは、頭から止めて見せる。
 * 飾りなので、読み上げには出さない（同じ内容は、近くの文で読める）。
 */
export function Led({ segments }: LedProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const encoded = JSON.stringify(segments)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const parsed = JSON.parse(encoded) as LedSegment[]
    const still = prefersReducedMotion()
    let bitmap: Bitmap | null = null
    let board: HTMLCanvasElement | null = null
    let pitch = 0
    let visible = 0
    let frame = 0
    let started = 0
    let lastOffset = -1
    let onScreen = true
    let disposed = false

    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const box = canvas.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      canvas.width = Math.round(box.width * ratio)
      canvas.height = Math.round(box.height * ratio)
      pitch = canvas.height / (ROWS + PAD * 2)
      visible = Math.ceil(canvas.width / pitch)

      // 消えている点は動かないので、別の板に 1 回だけ描いておく
      board = document.createElement('canvas')
      board.width = canvas.width
      board.height = canvas.height
      const under = board.getContext('2d')
      if (under) {
        under.fillStyle = UNLIT
        under.beginPath()
        for (let col = 0; col < visible; col++) {
          for (let row = 0; row < ROWS; row++) {
            const cx = (col + 0.5) * pitch
            const cy = (row + PAD + 0.5) * pitch
            under.moveTo(cx + pitch * 0.3, cy)
            under.arc(cx, cy, pitch * 0.3, 0, Math.PI * 2)
          }
        }
        under.fill()
      }
      lastOffset = -1
    }

    const paint = (offset: number) => {
      if (!bitmap || !board) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(board, 0, 0)
      const scrolls = bitmap.cols + LEAD > visible && !still
      const loop = bitmap.cols + GAP
      for (let index = 0; index < TONES.length; index++) {
        context.fillStyle = COLORS[TONES[index]]
        context.beginPath()
        for (let col = 0; col < visible; col++) {
          const at = scrolls ? (((col - LEAD + offset) % loop) + loop) % loop : col - LEAD
          if (at < 0 || at >= bitmap.cols || bitmap.tone[at] !== index) continue
          const mask = bitmap.lit[at]
          if (mask === 0) continue
          for (let row = 0; row < ROWS; row++) {
            if (!(mask & (1 << row))) continue
            const cx = (col + 0.5) * pitch
            const cy = (row + PAD + 0.5) * pitch
            context.moveTo(cx + pitch * 0.38, cy)
            context.arc(cx, cy, pitch * 0.38, 0, Math.PI * 2)
          }
        }
        context.fill()
      }
    }

    const tick = (now: number) => {
      frame = 0
      if (disposed || !bitmap) return
      const elapsed = now - started
      const offset = elapsed < HOLD ? 0 : Math.floor(((elapsed - HOLD) / 1000) * SPEED)
      if (offset !== lastOffset) {
        lastOffset = offset
        paint(offset)
      }
      const scrolls = bitmap.cols + LEAD > visible && !still
      if (scrolls && onScreen && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const restart = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      lastOffset = -1
      if (started === 0) started = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const begin = () => {
      if (disposed) return
      bitmap = rasterize(parsed)
      layout()
      started = performance.now()
      restart()
    }

    // 書体が読み込まれてから起こす（読み込めなくても、端末の等幅の字で起こして出す）
    const text = parsed.map((segment) => segment.text).join('')
    if (document.fonts?.load) document.fonts.load(FONT, text).then(begin, begin)
    else begin()

    const resized = new ResizeObserver(() => {
      if (!bitmap) return
      layout()
      restart()
    })
    resized.observe(canvas)

    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting)
      if (onScreen && bitmap) restart()
    })
    watcher.observe(canvas)

    const onVisibility = () => {
      if (!document.hidden && bitmap) restart()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      resized.disconnect()
      watcher.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [encoded])

  return (
    <div className="led" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
