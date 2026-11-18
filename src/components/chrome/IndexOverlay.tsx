import { useEffect, useRef, type CSSProperties } from 'react'

import { ROOMS } from '@/content/rooms'

// 札の傾き（度）。配ったトランプのように、少しずつばらつかせる
const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 3, -1, 2, -3]

type IndexOverlayProps = {
  /** いまいる部屋の id */
  active: string
  onClose: () => void
}

/** 目次。部屋を 1 枚ずつの札にして、画面いっぱいに並べる */
export function IndexOverlay({ active, onClose }: IndexOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  // 札を選んで閉じたときは、行き先の部屋から読み進められるように、フォーカスを元のボタンへ戻さない
  const chosen = useRef(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const root = document.documentElement
    const opener = document.activeElement
    root.dataset.lock = 'true'
    dialog.querySelector<HTMLElement>('[aria-current="location"]')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      // フォーカスが目次の外へ出ないように、端まで来たら反対の端へ送る
      const items = dialog.querySelectorAll<HTMLElement>('a[href], button')
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      delete root.dataset.lock
      document.removeEventListener('keydown', onKey)
      if (!chosen.current && opener instanceof HTMLElement) opener.focus()
    }
  }, [onClose])

  const choose = () => {
    chosen.current = true
    onClose()
  }

  return (
    <div ref={ref} className="index" role="dialog" aria-modal="true" aria-labelledby="index-title">
      <div className="index-bar">
        <h2 id="index-title" className="index-title">
          目次
        </h2>
        <button type="button" className="index-close" onClick={onClose}>
          閉じる
          <span className="index-close-icon" aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="ページ内の移動">
        <ol className="index-cards">
          {ROOMS.map((room, index) => {
            const current = room.id === active
            const style = { '--i': index, '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties
            return (
              <li key={room.id} style={style}>
                <a
                  href={`#${room.id}`}
                  className={`index-card tone-${room.tone}`}
                  aria-current={current ? 'location' : undefined}
                  onClick={choose}
                >
                  <span className="index-num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="index-glyph" aria-hidden="true">
                    {room.glyph}
                  </span>
                  <span className="index-label">{room.label}</span>
                  <span className="index-anchor" aria-hidden="true">
                    #{room.id}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
