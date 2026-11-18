import { ExternalLink } from '@/components/ui/ExternalLink'
import { Room } from '@/components/ui/Room'
import { profile } from '@/content'

export function Background() {
  const { background } = profile

  return (
    <Room id="background" title={background.title}>
      <ul className="dated">
        {background.items.map((item) => (
          <li key={item.name}>
            <span className="dated-when">{item.date}</span>
            <span>
              {item.url ? <ExternalLink href={item.url}>{item.name}</ExternalLink> : item.name}
              {item.note ? <span className="dated-note">{item.note}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </Room>
  )
}
