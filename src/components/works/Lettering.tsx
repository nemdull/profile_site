import lettering from '@/content/lettering.json'
import { useInView } from '@/lib/hooks'

/** sakujiru（作字）の欄の飾り。「作字」の 2 文字を、輪郭から描いて見せる */
export function Lettering() {
  const [ref, inView] = useInView<SVGSVGElement>('0px 0px -15% 0px')
  const width = lettering.letters.reduce((sum, letter) => sum + letter.width, 0)
  let offset = 0

  return (
    <svg
      ref={ref}
      className="lettering"
      data-inview={inView}
      viewBox={`0 0 ${width} ${lettering.height}`}
      aria-hidden="true"
    >
      {lettering.letters.map((letter) => {
        const x = offset
        offset += letter.width
        return <path key={letter.char} d={letter.d} pathLength={1} transform={`translate(${x} 0)`} />
      })}
    </svg>
  )
}
