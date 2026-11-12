import { createContext, useContext } from 'react'

import type { CheckId, FaultId } from './preflight'

export type CheckStatus = 'waiting' | 'running' | 'pass' | 'fail'
export type CheckState = { status: CheckStatus; detail: string }
export type Phase = 'idle' | 'running' | 'done'

export type Preflight = {
  /** いま壊してある所。壊していなければ null */
  fault: FaultId | null
  results: Record<CheckId, CheckState>
  phase: Phase
  passed: number
  failed: number
  /** 隕石を飛ばした回数。演出をやり直す鍵に使う */
  meteor: number
  /** 隕石が飛んでいる間 true */
  flying: boolean
  /** 衝突した瞬間だけ true */
  impact: boolean
  /** 隕石が飛んでいる間など、ボタンを押せない間は true */
  busy: boolean
  run: () => void
  strike: () => void
  repair: () => void
  /** 落ちた点検の、原因になった所まで画面を動かす */
  locate: (id: CheckId) => void
}

export const PreflightContext = createContext<Preflight | null>(null)

export function usePreflight(): Preflight {
  const value = useContext(PreflightContext)
  if (!value) throw new Error('PreflightProvider の外で usePreflight を呼んでいます')
  return value
}
