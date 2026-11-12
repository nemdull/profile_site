import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/hooks'

import { CHECKS, FAULTS, type CheckId, type FaultId } from './preflight'
import { PreflightContext, type CheckState, type Phase, type Preflight } from './preflight-context'

const blank = (): Record<CheckId, CheckState> =>
  Object.fromEntries(CHECKS.map((check) => [check.id, { status: 'waiting', detail: '' }])) as Record<CheckId, CheckState>

export function PreflightProvider({ children }: { children: ReactNode }) {
  const [fault, setFault] = useState<FaultId | null>(null)
  const [results, setResults] = useState(blank)
  const [phase, setPhase] = useState<Phase>('idle')
  const [runToken, setRunToken] = useState(0)
  const [meteor, setMeteor] = useState(0)
  const [impact, setImpact] = useState(false)
  const [flying, setFlying] = useState(false)

  const targets = useRef<Partial<Record<CheckId, Element | null>>>({})
  const lastFault = useRef<FaultId | null>(null)
  const timers = useRef<number[]>([])

  const later = useCallback((task: () => void, delay: number) => {
    timers.current.push(window.setTimeout(task, delay))
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  // 最初の点検は、見出しの動きが落ち着いてから
  useEffect(() => {
    const timer = window.setTimeout(() => setRunToken((token) => token + 1), prefersReducedMotion() ? 300 : 2800)
    return () => window.clearTimeout(timer)
  }, [])

  // 点検を上から順に走らせる。runToken が変わるたびにやり直す
  useEffect(() => {
    if (runToken === 0) return
    let cancelled = false
    const waits: number[] = []
    const pause = (ms: number) =>
      new Promise<void>((resolve) => {
        waits.push(window.setTimeout(resolve, ms))
      })
    const step = prefersReducedMotion() ? 0 : 240

    const runAll = async () => {
      setPhase('running')
      setResults(blank())
      targets.current = {}
      for (const check of CHECKS) {
        if (cancelled) return
        setResults((current) => ({ ...current, [check.id]: { status: 'running', detail: '' } }))
        await pause(step)
        const outcome = await check.run()
        if (cancelled) return
        targets.current[check.id] = outcome.target ?? null
        setResults((current) => ({
          ...current,
          [check.id]: { status: outcome.ok ? 'pass' : 'fail', detail: outcome.detail },
        }))
      }
      setPhase('done')
    }
    void runAll()

    return () => {
      cancelled = true
      waits.forEach((timer) => window.clearTimeout(timer))
    }
  }, [runToken])

  const run = useCallback(() => setRunToken((token) => token + 1), [])

  const strike = useCallback(() => {
    const candidates = FAULTS.filter((id) => id !== lastFault.current)
    const next = candidates[Math.floor(Math.random() * candidates.length)]
    lastFault.current = next
    const still = prefersReducedMotion()
    setFlying(true)
    setMeteor((count) => count + 1)
    later(
      () => {
        setFault(next)
        setImpact(true)
      },
      still ? 0 : 620,
    )
    later(
      () => {
        setImpact(false)
        setFlying(false)
        setRunToken((token) => token + 1)
      },
      still ? 60 : 1250,
    )
  }, [later])

  const repair = useCallback(() => {
    setFault(null)
    setRunToken((token) => token + 1)
  }, [])

  const locate = useCallback((id: CheckId) => {
    const target = targets.current[id]
    if (!(target instanceof HTMLElement)) return
    target.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    target.dataset.ping = 'true'
    window.setTimeout(() => delete target.dataset.ping, 2600)
  }, [])

  const value = useMemo<Preflight>(() => {
    const states = Object.values(results)
    return {
      fault,
      results,
      phase,
      passed: states.filter((state) => state.status === 'pass').length,
      failed: states.filter((state) => state.status === 'fail').length,
      meteor,
      flying,
      impact,
      busy: flying || phase === 'running',
      run,
      strike,
      repair,
      locate,
    }
  }, [fault, results, phase, meteor, impact, flying, run, strike, repair, locate])

  return <PreflightContext.Provider value={value}>{children}</PreflightContext.Provider>
}
