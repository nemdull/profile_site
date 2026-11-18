import { CHECKS, type CheckId } from '@/systems/preflight'
import { usePreflight } from '@/systems/preflight-context'

type CheckNoteProps = {
  id: CheckId
  className?: string
}

/**
 * 点検の結果を、確かめている物のすぐそばに出す札。
 * 中身は点検盤（#preflight）と同じ結果で、壊れればここも赤くなる。押すと点検盤へ飛ぶ。
 */
export function CheckNote({ id, className = '' }: CheckNoteProps) {
  const { results } = usePreflight()
  const check = CHECKS.find((entry) => entry.id === id)
  if (!check) return null
  const state = results[id]
  const value = state.status === 'waiting' ? '待機中' : state.status === 'running' ? '確認中' : state.brief

  return (
    <a href="#preflight" className={`note ${className}`.trim()} data-status={state.status}>
      <span className="lamp" aria-hidden="true" />
      <span className="note-key">{check.short}</span>
      <span className="note-val">{value}</span>
    </a>
  )
}
