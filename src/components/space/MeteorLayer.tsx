import { usePreflight } from '@/systems/preflight-context'

/** 隕石が画面を横切る演出。「隕石をぶつける」を押すたびに 1 回流れる */
export function MeteorLayer() {
  const { meteor, impact } = usePreflight()
  if (meteor === 0) return null

  return (
    <div aria-hidden="true">
      <span key={meteor} className="meteor" />
      {impact ? <span className="flash" /> : null}
    </div>
  )
}
