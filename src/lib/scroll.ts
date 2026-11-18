// スクロールと画面サイズの変化を、1 フレームに 1 回だけ配る。
// 動きを付ける部品はここに登録して、値は CSS 変数として DOM に直接書く（React の描き直しを起こさない）。

type Listener = (scrollY: number, viewportHeight: number) => void

const listeners = new Set<Listener>()
let frame = 0

const flush = () => {
  frame = 0
  const y = window.scrollY
  const height = window.innerHeight
  listeners.forEach((listener) => listener(y, height))
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(flush)
}

/** スクロールか画面サイズが変わるたびに呼ばれる。登録した直後にも 1 回呼ぶ。戻り値は解除の関数 */
export function onScrollFrame(listener: Listener) {
  if (listeners.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  listeners.add(listener)
  listener(window.scrollY, window.innerHeight)

  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) return
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  }
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/**
 * 画面に留まる演出の枠（中の舞台が sticky で留まる、背の高い枠）を、どこまで進んだか。
 * 枠の頭が画面の上に着いたときが 0、舞台が留まり終わるときが 1。
 * 留まる長さは「枠の高さ − 舞台の高さ」で決まる。画面の高さは使わない
 * （スマホではアドレスバーの出入りで画面の高さが変わるが、舞台の高さは変わらないので）。
 */
export function trackProgress(track: HTMLElement) {
  const stage = track.firstElementChild
  const held = track.offsetHeight - (stage instanceof HTMLElement ? stage.offsetHeight : window.innerHeight)
  return clamp(-track.getBoundingClientRect().top / Math.max(1, held))
}
