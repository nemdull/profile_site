import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCE = '(prefers-reduced-motion: reduce)'

const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** 端末の「動きを減らす」設定。イベントの中など、フックを使えない所から読むとき用 */
export const prefersReducedMotion = () => window.matchMedia(REDUCE).matches

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false)
}

/** 要素が初めて画面に入ったら true になる（一度きり） */
export function useInView<T extends Element>(rootMargin = '0px 0px -18% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView] as const
}
